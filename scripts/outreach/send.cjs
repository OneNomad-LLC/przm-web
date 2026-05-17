/* eslint-disable */
/**
 * Outreach mailer. Three plays (maintainer / charter / newsletter).
 * Reads recipients + templates, fills variables, sends via Resend.
 *
 * USAGE
 *   node scripts/outreach/send.cjs --play maintainer [--dry-run | --send] [--only <id>]
 *
 * DEFAULTS to --dry-run. Will not send anything unless you pass --send.
 *
 * ENV
 *   RESEND_API_KEY   required for --send
 *
 * Recipients with email=null are SKIPPED with a note (use their
 * contactNotes field to do those touches manually via DM / Discord /
 * contact form).
 *
 * Each send also writes a row to the local outreach.log file at
 * scripts/outreach/outreach.log so you have an offline record of
 * what went out and when, independent of Resend's dashboard.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname);
// recipients.json lives outside the public repo (local-data/ is gitignored)
// because the per-recipient pitch notes are not for public consumption.
// See README.md in this directory for the schema.
const RECIPIENTS_PATH = path.join(__dirname, '..', '..', 'local-data', 'outreach', 'recipients.json');
if (!fs.existsSync(RECIPIENTS_PATH)) {
  console.error(`recipients.json not found at ${RECIPIENTS_PATH}.`);
  console.error('Expected location: <repo-root>/local-data/outreach/recipients.json');
  console.error('This file is gitignored; ask Matt for the current copy.');
  process.exit(1);
}
const RECIPIENTS = JSON.parse(fs.readFileSync(RECIPIENTS_PATH, 'utf-8'));
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const LOG_PATH = path.join(__dirname, '..', '..', 'local-data', 'outreach', 'outreach.log');

const FROM = 'Matt Stvartak <hello@przm.sh>';
const REPLY_TO = 'hello@onenomad.dev';

function parseArgs(argv) {
  const out = { play: null, mode: 'dry-run', only: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--play') out.play = argv[++i];
    else if (a === '--send') out.mode = 'send';
    else if (a === '--dry-run') out.mode = 'dry-run';
    else if (a === '--only') out.only = argv[++i];
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
  }
  if (!out.play || !RECIPIENTS[out.play]) {
    printHelp();
    process.exit(1);
  }
  return out;
}

function printHelp() {
  console.log(`
Usage: node scripts/outreach/send.cjs --play <play> [--dry-run | --send] [--only <id>]

Plays:
  maintainer   Framework maintainer respect-move outreach (5 recipients)
  charter      Vendor cert charter outreach (5 recipients)
  newsletter   Earned media pitches (3 recipients)

Default is --dry-run. Pass --send to actually deliver.

  --only <id>  Send to only one recipient (id from recipients.json).
               Useful for testing one before batching.
`);
}

function loadTemplate(play) {
  const file = path.join(TEMPLATES_DIR, `${play}.txt`);
  if (!fs.existsSync(file)) {
    console.error('template not found: ' + file);
    process.exit(1);
  }
  return fs.readFileSync(file, 'utf-8');
}

function substitute(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key in vars) return vars[key];
    return '{{' + key + '}}'; // leave unresolved so it's visible in dry-run
  });
}

function splitSubjectBody(filled) {
  const lines = filled.split('\n');
  let subject = '';
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('Subject:')) {
      subject = line.slice('Subject:'.length).trim();
      i++;
      while (i < lines.length && lines[i].trim() === '') i++;
      break;
    }
  }
  const body = lines.slice(i).join('\n');
  return { subject, body };
}

function firstNameFrom(fullName) {
  return fullName.split(/\s+/)[0];
}

async function sendOne({ recipient, subject, body, mode, resendKey }) {
  if (mode === 'dry-run' || !resendKey) {
    return { ok: true, dryRun: true };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: recipient.email,
      replyTo: REPLY_TO,
      subject,
      text: body,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    return { ok: false, error: data.error?.message || `HTTP ${res.status}` };
  }
  return { ok: true, id: data.id };
}

function appendLog(entry) {
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n', 'utf-8');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const template = loadTemplate(args.play);
  const candidates = RECIPIENTS[args.play].filter((r) =>
    args.only ? r.id === args.only : true,
  );
  if (candidates.length === 0) {
    console.error('no recipients matched');
    process.exit(1);
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (args.mode === 'send' && !resendKey) {
    console.error('RESEND_API_KEY not set; cannot --send');
    process.exit(1);
  }

  console.log(`\n=== ${args.play} play, mode=${args.mode}, ${candidates.length} recipient(s) ===\n`);

  for (const r of candidates) {
    const tag = `[${r.id}]`;

    if (r.sendable === false) {
      console.log(`${tag} SKIP — flagged sendable:false (track-only / do-not-cold-pitch). Notes: ${r.contactNotes}\n`);
      continue;
    }

    if (!r.email) {
      console.log(`${tag} SKIP — no email. Manual touch needed: ${r.contactNotes}\n`);
      continue;
    }

    const vars = {
      firstName: firstNameFrom(r.name),
      name: r.name,
      company: r.company || r.outlet || '',
      framework: r.framework || '',
      outlet: r.outlet || '',
      ...r.vars,
    };
    const filled = substitute(template, vars);
    const { subject, body } = splitSubjectBody(filled);

    console.log(`${tag} → ${r.name} <${r.email}>`);
    console.log(`     Subject: ${subject}`);
    console.log(`     ─────`);
    console.log(body.split('\n').map((l) => `     ${l}`).join('\n'));
    console.log(`     ─────`);

    if (args.mode === 'send') {
      const result = await sendOne({ recipient: r, subject, body, mode: args.mode, resendKey });
      if (result.ok) {
        console.log(`     ✓ SENT  resend_id=${result.id}\n`);
        appendLog({
          ts: new Date().toISOString(),
          play: args.play,
          recipient_id: r.id,
          to: r.email,
          subject,
          resend_id: result.id,
          ok: true,
        });
      } else {
        console.log(`     ✗ FAILED  ${result.error}\n`);
        appendLog({
          ts: new Date().toISOString(),
          play: args.play,
          recipient_id: r.id,
          to: r.email,
          subject,
          ok: false,
          error: result.error,
        });
      }
    } else {
      console.log(`     [dry-run — not sent]\n`);
    }
  }

  if (args.mode === 'dry-run') {
    console.log('Dry run complete. To actually send, re-run with --send.');
  } else {
    console.log(`Log written to ${LOG_PATH}`);
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});

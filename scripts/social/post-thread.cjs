/* eslint-disable */
/**
 * Post a tweet thread to X from @przm_ai via the v2 API.
 *
 * Reads a JSON file describing the thread, OAuth 1.0a-signs each
 * request, posts the first tweet, then chains the rest as replies.
 *
 * USAGE
 *   node scripts/social/post-thread.cjs <path-to-thread.json> [--dry-run | --send]
 *
 * Defaults to --dry-run. Nothing posts unless you pass --send.
 *
 * INPUT JSON SHAPE
 *   {
 *     "tweets": [
 *       "First tweet text (≤280 chars)",
 *       "Reply 1",
 *       "Reply 2"
 *     ]
 *   }
 *
 * ENV (required for --send; pulled from Windows Credential Manager
 *      via PowerShell before invocation)
 *   X_API_KEY              consumer key
 *   X_API_KEY_SECRET       consumer secret
 *   X_ACCESS_TOKEN         user access token (account: @przm_ai)
 *   X_ACCESS_TOKEN_SECRET  user access token secret
 *
 * COST (pay-per-use tier as of 2026-05-17): $0.01 per post.
 * A 5-tweet thread is $0.05. Reads $0.005 each (not used here).
 *
 * APPENDS one JSONL line per posted tweet to
 *   scripts/social/x-posts.log
 * so we have an offline record correlating thread-step → tweet id.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LOG_PATH = path.join(__dirname, 'x-posts.log');
const API_URL = 'https://api.x.com/2/tweets';

// ── arg parsing ─────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = { path: null, mode: 'dry-run', debug: false };
  for (const a of argv.slice(2)) {
    if (a === '--send') out.mode = 'send';
    else if (a === '--dry-run') out.mode = 'dry-run';
    else if (a === '--debug') out.debug = true;
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
    else if (!a.startsWith('--')) out.path = a;
  }
  if (!out.path) { printHelp(); process.exit(1); }
  return out;
}
function printHelp() {
  console.log(`
Usage: node scripts/social/post-thread.cjs <thread.json> [--dry-run | --send]

Defaults to --dry-run. Pass --send to actually post.

Env (required for --send): X_API_KEY, X_API_KEY_SECRET,
                           X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
`);
}

// ── thread validation ───────────────────────────────────────────────
function loadThread(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('thread file not found: ' + filePath);
    process.exit(1);
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(parsed.tweets) || parsed.tweets.length === 0) {
    console.error('thread file must have a `tweets` array with ≥1 entry');
    process.exit(1);
  }
  const tooLong = parsed.tweets
    .map((t, i) => ({ i, len: [...t].length, text: t }))
    .filter((x) => x.len > 280);
  if (tooLong.length > 0) {
    console.error('the following tweets exceed 280 characters:');
    for (const x of tooLong) console.error(`  #${x.i + 1}: ${x.len} chars`);
    process.exit(1);
  }
  return parsed.tweets;
}

// ── OAuth 1.0a HMAC-SHA1 signer ────────────────────────────────────
function percentEncode(s) {
  return encodeURIComponent(s)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function buildOAuthHeader({ method, url, consumerKey, consumerSecret, accessToken, accessTokenSecret }) {
  const oauth = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };
  // For JSON POST bodies, the body is NOT included in the signature base —
  // only OAuth params + query string params (we have none here) participate.
  const paramString = Object.keys(oauth)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauth[k])}`)
    .join('&');
  const base = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join('&');
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessTokenSecret)}`;
  oauth.oauth_signature = crypto
    .createHmac('sha1', signingKey)
    .update(base)
    .digest('base64');
  const header =
    'OAuth ' +
    Object.keys(oauth)
      .sort()
      .map((k) => `${percentEncode(k)}="${percentEncode(oauth[k])}"`)
      .join(', ');
  return header;
}

// ── tweet posting ───────────────────────────────────────────────────
async function postOne({ text, replyToId, creds, debug }) {
  const body = replyToId
    ? { text, reply: { in_reply_to_tweet_id: replyToId } }
    : { text };
  const auth = buildOAuthHeader({
    method: 'POST',
    url: API_URL,
    consumerKey: creds.apiKey,
    consumerSecret: creds.apiKeySecret,
    accessToken: creds.accessToken,
    accessTokenSecret: creds.accessTokenSecret,
  });
  if (debug) {
    console.error('\n--- DEBUG ---');
    console.error('Credential lengths (paste artifacts often add whitespace):');
    console.error('  apiKey:             ' + creds.apiKey.length + ' chars, trimmed=' + creds.apiKey.trim().length);
    console.error('  apiKeySecret:       ' + creds.apiKeySecret.length + ' chars, trimmed=' + creds.apiKeySecret.trim().length);
    console.error('  accessToken:        ' + creds.accessToken.length + ' chars, trimmed=' + creds.accessToken.trim().length);
    console.error('  accessTokenSecret:  ' + creds.accessTokenSecret.length + ' chars, trimmed=' + creds.accessTokenSecret.trim().length);
    console.error('Authorization header (signature redacted):');
    console.error('  ' + auth.replace(/oauth_signature="[^"]*"/, 'oauth_signature="<redacted>"'));
    console.error('--- /DEBUG ---\n');
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, status: res.status, error: data };
  }
  return { ok: true, id: data?.data?.id, text: data?.data?.text };
}

function appendLog(entry) {
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n', 'utf-8');
}

// ── main ────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv);
  const tweets = loadThread(args.path);

  console.log(`\n=== X thread, ${args.mode}, ${tweets.length} tweet(s) ===`);
  console.log(`File: ${args.path}\n`);

  // Always print preview
  tweets.forEach((t, i) => {
    const len = [...t].length;
    console.log(`[${String(i + 1).padStart(2, '0')}] (${len} chars)`);
    console.log(t.split('\n').map((l) => '     ' + l).join('\n'));
    console.log('');
  });

  if (args.mode === 'dry-run') {
    console.log(`Dry run complete. Estimated cost on send: $${(tweets.length * 0.01).toFixed(2)}.`);
    console.log('Re-run with --send to actually post.');
    return;
  }

  // --send: pull creds from env
  const creds = {
    apiKey: process.env.X_API_KEY,
    apiKeySecret: process.env.X_API_KEY_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
  };
  const missing = Object.entries(creds).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.error('missing env vars: ' + missing.join(', '));
    console.error('Pull them from the vault first:');
    console.error('  $env:X_API_KEY = Get-Secret -Vault OneNomadPrzm -Name x-api-key -AsPlainText');
    console.error('  (etc. for the other three)');
    process.exit(1);
  }

  let lastId = null;
  let firstId = null;
  for (let i = 0; i < tweets.length; i++) {
    const tag = `[${String(i + 1).padStart(2, '0')}]`;
    process.stdout.write(`${tag} posting... `);
    const result = await postOne({ text: tweets[i], replyToId: lastId, creds, debug: args.debug });
    if (!result.ok) {
      console.log(`✗ FAILED (HTTP ${result.status})`);
      console.error(JSON.stringify(result.error, null, 2));
      appendLog({
        ts: new Date().toISOString(),
        threadFile: args.path,
        index: i,
        text: tweets[i],
        ok: false,
        status: result.status,
        error: result.error,
      });
      console.error(`\nStopping after partial thread. Tweets 1–${i} posted; tweet ${i + 1} failed.`);
      console.error(`Last tweet ID: ${lastId ?? '(none)'} — pass --resume-from <id> to retry from here (not yet implemented; for now, edit the thread file to remove already-posted tweets and re-run).`);
      process.exit(1);
    }
    console.log(`✓ ${result.id}`);
    appendLog({
      ts: new Date().toISOString(),
      threadFile: args.path,
      index: i,
      text: tweets[i],
      ok: true,
      id: result.id,
      replyToId: lastId,
    });
    lastId = result.id;
    if (firstId === null) firstId = result.id;
  }

  console.log(`\n✓ Thread posted. ${tweets.length} tweet(s). First tweet:`);
  console.log(`  https://x.com/przm_ai/status/${firstId}`);
  console.log(`Log: ${LOG_PATH}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});

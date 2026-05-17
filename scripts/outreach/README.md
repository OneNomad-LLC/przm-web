# Outreach mailer

Send the three outreach plays from the GTM playbook through Resend without copy-pasting templates one at a time.

## Quick usage

```powershell
# Pull RESEND_API_KEY from the vault for this shell only
$env:RESEND_API_KEY = Get-Secret -Vault OneNomadPrzm -Name resend-api-key -AsPlainText

# Dry-run: see exactly what would be sent, no mail goes out
node scripts/outreach/send.cjs --play maintainer
node scripts/outreach/send.cjs --play charter
node scripts/outreach/send.cjs --play newsletter

# Send just one recipient to sanity-check end-to-end (use any --play)
node scripts/outreach/send.cjs --play newsletter --only interconnects-nathan --send

# Send the full batch for a play
node scripts/outreach/send.cjs --play maintainer --send
```

## What's where

- `../../local-data/outreach/recipients.json` — names, companies, contact info, per-recipient template variables. **Lives outside the public repo** (`local-data/` is gitignored) because the per-recipient pitch notes critique real people and companies. Ask Matt if you need the current copy.
- `templates/maintainer.txt` — Play 1: framework-maintainer respect-move outreach.
- `templates/charter.txt` — Play 2: vendor-cert charter pitch.
- `templates/newsletter.txt` — Play 3: earned-media pitches.
- `send.cjs` — the runner.
- `../../local-data/outreach/outreach.log` (created on first `--send`) — append-only JSONL of every send + Resend message id.

## Important constraints

- **Recipients with `email: null` are skipped** with a note. Those need manual outreach (DM, Discord, contact form). The note in `contactNotes` explains the channel.
- **Subject lines are taken from the first `Subject:` line of each template.** Anything before is ignored; anything after the blank line is the body.
- **Variable substitution** is `{{var}}`. Unresolved vars are left visible in dry-run output so you can spot missing fields before sending.
- **From address** is `Matt Stvartak <hello@przm.sh>`. **Reply-To** is `hello@onenomad.dev`. (Reply-To here is your inbox, not the agent-inbox plus-address — outreach replies should land in your normal mail, not get auto-filed against a submission that doesn't exist yet.)

## Sequencing

Per `content/go-to-market/launch-sequence.md`:

- Day 1: Charter Play (5 most likely close)
- Day 2: Maintainer Play (5 framework owners, one per recipient)
- Day 3: Newsletter Play (3 viable; do NOT cold-email Latent Space)
- Day 8: HN submission (after maintainers have had time to engage)

The script doesn't enforce timing; that's on you.

## Verifying before --send

Always do this once before the first real send:

```powershell
node scripts/outreach/send.cjs --play maintainer
```

Skim the output. If any recipient's email or template variables look wrong, fix `recipients.json` or the template before sending.

## After --send

Each send appends one JSONL line to `outreach.log` with the Resend message id. Use that to correlate inbound responses arriving at the agent inbox (`/admin/inbox`).

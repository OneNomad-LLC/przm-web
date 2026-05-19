/* eslint-disable */
/**
 * Send a single X DM via the v2 API.
 *
 *   node scripts/social/post-dm.cjs --to <username> --text "<message>" [--send] [--debug]
 *
 * Defaults to dry-run. Pass --send to actually fire.
 *
 * Two-step:
 *   1. GET /2/users/by/username/:username  →  numeric user ID
 *   2. POST /2/dm_conversations/with/:id/messages  →  send DM
 *
 * Requires OAuth 1.0a user context (same four creds as post-thread.cjs)
 * AND app permission "Read, write, and direct messages" on the X
 * Developer Portal.
 *
 * Env:
 *   X_API_KEY, X_API_KEY_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
 *
 * Recipient must either follow @przm_ai OR have "Allow message
 * requests from everyone" enabled; otherwise the DM lands in their
 * Message Requests folder.
 */
const crypto = require('node:crypto');

function percentEncode(s) {
  return encodeURIComponent(s).replace(/[!*'()]/g, (c) =>
    '%' + c.charCodeAt(0).toString(16).toUpperCase(),
  );
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
  const params = Object.keys(oauth)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauth[k])}`)
    .join('&');
  const base = [method.toUpperCase(), percentEncode(url), percentEncode(params)].join('&');
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessTokenSecret)}`;
  oauth.oauth_signature = crypto.createHmac('sha1', signingKey).update(base).digest('base64');
  return 'OAuth ' + Object.keys(oauth)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauth[k])}"`)
    .join(', ');
}

function parseArgs(argv) {
  const out = { to: null, text: null, send: false, debug: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--to') out.to = argv[++i];
    else if (a === '--text') out.text = argv[++i];
    else if (a === '--send') out.send = true;
    else if (a === '--debug') out.debug = true;
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.to || !args.text) {
    console.error('Usage: node scripts/social/post-dm.cjs --to <username> --text "<message>" [--send] [--debug]');
    process.exit(1);
  }
  const creds = {
    apiKey: process.env.X_API_KEY,
    apiKeySecret: process.env.X_API_KEY_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
  };
  for (const k of Object.keys(creds)) {
    if (!creds[k]) { console.error(`Missing env var for ${k}`); process.exit(1); }
  }

  const username = args.to.replace(/^@/, '');
  console.log(`Recipient: @${username}`);
  console.log(`Text (${args.text.length} chars): ${args.text}\n`);

  if (!args.send) {
    console.log('[dry-run — pass --send to actually post]');
    return;
  }

  // Step 1: look up user ID
  const lookupUrl = `https://api.x.com/2/users/by/username/${encodeURIComponent(username)}`;
  const lookupAuth = buildOAuthHeader({
    method: 'GET',
    url: lookupUrl,
    consumerKey: creds.apiKey,
    consumerSecret: creds.apiKeySecret,
    accessToken: creds.accessToken,
    accessTokenSecret: creds.accessTokenSecret,
  });
  if (args.debug) console.log(`GET ${lookupUrl}\n  ${lookupAuth.replace(/oauth_signature="[^"]*"/, 'oauth_signature="<redacted>"')}\n`);
  const lookupRes = await fetch(lookupUrl, { headers: { Authorization: lookupAuth } });
  const lookupBody = await lookupRes.text();
  if (!lookupRes.ok) {
    console.error(`User lookup FAILED (HTTP ${lookupRes.status}):`);
    console.error(lookupBody);
    process.exit(2);
  }
  const lookupJson = JSON.parse(lookupBody);
  const userId = lookupJson?.data?.id;
  if (!userId) {
    console.error('User lookup returned no id:', lookupBody);
    process.exit(2);
  }
  console.log(`✓ Resolved @${username} → ${userId}`);

  // Step 2: send DM
  const dmUrl = `https://api.x.com/2/dm_conversations/with/${userId}/messages`;
  const dmAuth = buildOAuthHeader({
    method: 'POST',
    url: dmUrl,
    consumerKey: creds.apiKey,
    consumerSecret: creds.apiKeySecret,
    accessToken: creds.accessToken,
    accessTokenSecret: creds.accessTokenSecret,
  });
  if (args.debug) console.log(`\nPOST ${dmUrl}\n  ${dmAuth.replace(/oauth_signature="[^"]*"/, 'oauth_signature="<redacted>"')}\n`);
  const dmRes = await fetch(dmUrl, {
    method: 'POST',
    headers: { Authorization: dmAuth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: args.text }),
  });
  const dmBody = await dmRes.text();
  console.log(`\nHTTP ${dmRes.status} ${dmRes.statusText}`);
  if (args.debug) {
    for (const [k, v] of dmRes.headers.entries()) {
      if (k.startsWith('x-') || k === 'content-type') console.log(`  ${k}: ${v}`);
    }
  }
  console.log('Body:', dmBody);
  if (dmRes.ok) console.log('\n✓ DM SENT');
  else process.exit(3);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });

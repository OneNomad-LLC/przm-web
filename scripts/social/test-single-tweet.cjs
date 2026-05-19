/* eslint-disable */
/**
 * Single-tweet smoke test for the X API auth chain.
 *
 * Posts exactly one tweet ("przm API test — please ignore" + timestamp).
 * Used to iterate quickly when debugging 403/auth issues. Once the API
 * works again, delete the test tweet manually.
 *
 *   node scripts/social/test-single-tweet.cjs --send
 *   node scripts/social/test-single-tweet.cjs --debug --send  (dumps headers)
 *
 * Env (same as post-thread.cjs):
 *   X_API_KEY, X_API_KEY_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
 */
const crypto = require('node:crypto');

const API_URL = 'https://api.x.com/2/tweets';

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

async function main() {
  const args = process.argv.slice(2);
  const debug = args.includes('--debug');
  const send = args.includes('--send');

  const creds = {
    apiKey: process.env.X_API_KEY,
    apiKeySecret: process.env.X_API_KEY_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
  };
  for (const k of Object.keys(creds)) {
    if (!creds[k]) {
      console.error(`Missing env var for ${k}`);
      process.exit(1);
    }
  }

  const text = `przm API test ${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)} — please ignore`;
  console.log('Text:', text, `(${text.length} chars)`);

  if (debug) {
    console.log('\nCredential lengths:');
    console.log(`  apiKey:            ${creds.apiKey.length}`);
    console.log(`  apiKeySecret:      ${creds.apiKeySecret.length}`);
    console.log(`  accessToken:       ${creds.accessToken.length} (starts: ${creds.accessToken.slice(0, 8)}...)`);
    console.log(`  accessTokenSecret: ${creds.accessTokenSecret.length}`);
  }

  if (!send) {
    console.log('\n[dry-run — pass --send to actually post]');
    return;
  }

  const auth = buildOAuthHeader({
    method: 'POST',
    url: API_URL,
    consumerKey: creds.apiKey,
    consumerSecret: creds.apiKeySecret,
    accessToken: creds.accessToken,
    accessTokenSecret: creds.accessTokenSecret,
  });

  if (debug) {
    console.log('\nAuth header (signature redacted):');
    console.log('  ' + auth.replace(/oauth_signature="[^"]*"/, 'oauth_signature="<redacted>"'));
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const body = await res.text();
  console.log(`\nHTTP ${res.status} ${res.statusText}`);
  console.log('Headers:');
  for (const [k, v] of res.headers.entries()) {
    if (k.startsWith('x-') || k === 'content-type') console.log(`  ${k}: ${v}`);
  }
  console.log('Body:', body);

  if (res.ok) {
    console.log('\n✓ TEST TWEET POSTED. Delete it manually if you want it gone.');
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});

/* eslint-disable */
const { neon } = require('@neondatabase/serverless');
const id = process.argv[2];
if (!id) { console.error('usage: node check-submission.cjs <uuid>'); process.exit(1); }
const sql = neon(process.env.DATABASE_URL);
(async () => {
  const rows = await sql`SELECT id, tier, email, company, framework, release_version, status, created_at FROM submissions WHERE id = ${id}`;
  console.log(JSON.stringify(rows, null, 2));
})();

/* eslint-disable */
const { neon } = require('@neondatabase/serverless');
const id = process.argv[2];
if (!id) { console.error('usage: node delete-submission.cjs <uuid>'); process.exit(1); }
const sql = neon(process.env.DATABASE_URL);
(async () => {
  await sql`DELETE FROM replies WHERE submission_id = ${id}`;
  const r = await sql`DELETE FROM submissions WHERE id = ${id} RETURNING id, email`;
  console.log('deleted:', JSON.stringify(r));
})();

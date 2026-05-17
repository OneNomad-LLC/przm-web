/* eslint-disable */
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

(async () => {
  // Delete any reply row that never actually got sent (no resend_id)
  const del = await sql.query("DELETE FROM replies WHERE resend_id IS NULL RETURNING id");
  console.log('Deleted reply rows: ' + del.length);

  // Reset any submission to 'new' if it has no real replies but was marked 'replied'
  const upd = await sql.query(
    "UPDATE submissions SET status='new', updated_at=NOW() WHERE id NOT IN (SELECT DISTINCT submission_id FROM replies) AND status='replied' RETURNING id"
  );
  console.log('Submissions reset to new: ' + upd.length);

  // Show current state
  const subs = await sql.query('SELECT id, status, email, created_at FROM submissions ORDER BY created_at DESC');
  console.log('\nCurrent submissions:');
  subs.forEach((s) => console.log('  ' + s.id.slice(0, 8) + ' ' + s.status.padEnd(10) + ' ' + s.email));
})();

import pg from "pg";

const { Pool } = pg;

export const dbEnabled = Boolean(process.env.DATABASE_URL);

let pool;
if (dbEnabled) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "false"
        ? false
        : { rejectUnauthorized: false }
  });
}

export async function initDb() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      token TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      save JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

export async function upsertAccount(token, name, role, save) {
  if (!pool) return null;
  const result = await pool.query(
    `
      INSERT INTO accounts (token, name, role, save, updated_at)
      VALUES ($1, $2, $3, $4::jsonb, now())
      ON CONFLICT (token)
      DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, save = EXCLUDED.save, updated_at = now()
      RETURNING token, name, role, save, updated_at
    `,
    [token, name, role, JSON.stringify(save)]
  );
  return result.rows[0] || null;
}

export async function getAccount(token) {
  if (!pool) return null;
  const result = await pool.query(
    `SELECT token, name, role, save, updated_at FROM accounts WHERE token = $1`,
    [token]
  );
  return result.rows[0] || null;
}

export async function leaderboard(limit = 50) {
  if (!pool) return [];
  const result = await pool.query(
    `
      SELECT name, role, save, updated_at
      FROM accounts
      ORDER BY (save -> 'profile' -> 'abilities')::text DESC, updated_at DESC
      LIMIT $1
    `,
    [limit]
  );
  return result.rows.map((row) => ({
    name: row.name,
    role: row.role,
    score: Object.values(row.save?.profile?.abilities || {}).reduce(
      (sum, value) => sum + Number(value || 0),
      0
    ),
    updatedAt: row.updated_at
  }));
}

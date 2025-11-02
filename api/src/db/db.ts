import { Pool, type PoolClient } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000
});

pool.on("connect", () => {
  console.log("Base de datos conectada a PostgreSQL");
});
pool.on("error", (err: any) => {
  console.error("Base de datos hay un error en pool:", err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export async function runInTransaction<T>(handler: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await handler(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
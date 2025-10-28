import { Pool } from "pg";

const pool = new Pool({
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
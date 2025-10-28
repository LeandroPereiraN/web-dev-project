import { query } from "../db/db.ts";
import { type Static } from "@sinclair/typebox";
import { User } from "../model/users-model.ts";

type UserType = Static<typeof User>;

class UserRepository {
  static async authenticate(email: string, password: string): Promise<UserType | null> {
    const sqlAuth = `
      SELECT * FROM users
      WHERE email = $1 AND password = crypt($2, password)
    `;

    const { rows } = await query(sqlAuth, [email, password]);
    return rows[0] || null;
  }

  static async getUserByEmail(email: string): Promise<UserType | null> {
    const sql = `
      SELECT * FROM users WHERE email = $1
    `;

    const { rows } = await query(sql, [email]);
    return rows[0] || null;
  }

  static async getUserById(id: number): Promise<UserType | null> {
    const sql = `
      SELECT * FROM users WHERE id = $1
    `;

    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  }
}

export default UserRepository;
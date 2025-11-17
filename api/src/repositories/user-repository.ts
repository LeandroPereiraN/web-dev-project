import type { PoolClient } from "pg";
import { query } from "../db/db.js";
import { type Static } from "@sinclair/typebox";
import { User, UserUpdateInput } from "../model/users-model.js";
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
} from "../plugins/errors.js";

type UserType = Static<typeof User>;
type UserUpdatePayload = Static<typeof UserUpdateInput>;

class UserRepository {
  static async authenticate(
    email: string,
    password: string
  ): Promise<UserType | null> {
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

  static async createUser(
    userData: Omit<
      UserType,
      | "id"
      | "registration_date"
      | "is_active"
      | "is_suspended"
      | "average_rating"
      | "total_completed_jobs"
      | "last_job_date"
      | "created_at"
      | "updated_at"
      | "role"
    > & { password: string }
  ): Promise<UserType> {
    const existing = await this.getUserByEmail(userData.email);
    if (existing) throw new EmailAlreadyExistsError();

    const sql = `
      INSERT INTO users (email, password, first_name, last_name, phone, address, specialty, years_experience, professional_description, profile_picture_url, role)
      VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, $5, $6, $7, $8, $9, $10, 'SELLER')
      RETURNING *
    `;

    const values = [
      userData.email,
      userData.password,
      userData.first_name,
      userData.last_name,
      userData.phone,
      userData.address,
      userData.specialty,
      userData.years_experience,
      userData.professional_description,
      userData.profile_picture_url,
    ];

    const { rows } = await query(sql, values);
    return rows[0];
  }

  static async updateUserProfile(
    userId: number,
    payload: UserUpdatePayload
  ): Promise<UserType> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    const assign = (column: string, value: any) => {
      fields.push(`${column} = $${index}`);
      values.push(value);
      index += 1;
    };

    if (payload.first_name !== undefined)
      assign("first_name", payload.first_name.trim());
    if (payload.last_name !== undefined)
      assign("last_name", payload.last_name.trim());
    if (payload.phone !== undefined) assign("phone", payload.phone.trim());
    if (payload.address !== undefined)
      assign("address", payload.address?.trim() || null);
    if (payload.specialty !== undefined)
      assign("specialty", payload.specialty?.trim() || null);
    if (payload.years_experience !== undefined)
      assign("years_experience", payload.years_experience);
    if (payload.professional_description !== undefined)
      assign(
        "professional_description",
        payload.professional_description?.trim() || null
      );
    if (payload.profile_picture_url !== undefined)
      assign(
        "profile_picture_url",
        payload.profile_picture_url?.trim() || null
      );

    if (!fields.length) {
      const existing = await this.getUserById(userId);
      if (!existing) throw new UserNotFoundError();
      return existing;
    }

    fields.push(`updated_at = NOW()`);

    const sql = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `;
    values.push(userId);

    const { rows } = await query(sql, values);
    const updated = rows[0];
    if (!updated) throw new UserNotFoundError();
    return updated;
  }

  static async verifyPassword(
    userId: number,
    password: string
  ): Promise<boolean> {
    const sql = `
      SELECT 1
      FROM users
      WHERE id = $1 AND password = crypt($2, password)
    `;
    const { rows } = await query(sql, [userId, password]);
    return Boolean(rows[0]);
  }

  static async updatePassword(
    userId: number,
    newPassword: string,
    client?: PoolClient
  ): Promise<void> {
    const sql = `
      UPDATE users
      SET password = crypt($2, gen_salt('bf')), updated_at = NOW()
      WHERE id = $1
    `;
    if (client) {
      await client.query(sql, [userId, newPassword]);
    } else {
      await query(sql, [userId, newPassword]);
    }
  }

  static async deleteUser(userId: number, client?: PoolClient): Promise<void> {
    if (client) {
      await client.query(`DELETE FROM users WHERE id = $1`, [userId]);
    } else {
      await query(`DELETE FROM users WHERE id = $1`, [userId]);
    }
  }

  static async suspendUser(userId: number, client?: PoolClient): Promise<void> {
    const sql = `
      UPDATE users
      SET is_suspended = TRUE,
          is_active = FALSE,
          updated_at = NOW()
      WHERE id = $1
    `;
    if (client) {
      await client.query(sql, [userId]);
    } else {
      await query(sql, [userId]);
    }
  }

  static async activateUser(
    userId: number,
    client?: PoolClient
  ): Promise<void> {
    const sql = `
      UPDATE users
      SET is_suspended = FALSE,
          is_active = TRUE,
          updated_at = NOW()
      WHERE id = $1
    `;
    if (client) {
      await client.query(sql, [userId]);
    } else {
      await query(sql, [userId]);
    }
  }

  static async deleteSessions(
    userId: number,
    client?: PoolClient
  ): Promise<void> {
    if (client) {
      await client.query(`DELETE FROM user_sessions WHERE user_id = $1`, [
        userId,
      ]);
    } else {
      await query(`DELETE FROM user_sessions WHERE user_id = $1`, [userId]);
    }
  }
}

export default UserRepository;

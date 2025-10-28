import { query } from "../db/db.ts";
import { type Static } from "@sinclair/typebox";
import { User } from "../model/users-model.ts";
import { EmailAlreadyExistsError } from "../plugins/errors.ts";

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

  static async createUser(userData: Omit<UserType, 'id' | 'registration_date' | 'is_active' | 'is_suspended' | 'average_rating' | 'total_completed_jobs' | 'last_job_date' | 'created_at' | 'updated_at' | 'role'> & { password: string }): Promise<UserType> {
    const existing = await this.getUserByEmail(userData.email);
    if (existing) throw new EmailAlreadyExistsError();

    const sql = `
      INSERT INTO users (email, password, first_name, last_name, phone, address, specialty, years_experience, professional_description, role)
      VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, $5, $6, $7, $8, $9, 'SELLER')
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
    ];

    const { rows } = await query(sql, values);
    return rows[0];
  }
}

export default UserRepository;
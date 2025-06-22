import { pool } from "../db/client";
import { UserInput } from "../schemas/user.schema";

export class UserModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        reset_token TEXT,
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT current_timestamp
      );
    `;
    await pool.query(query);
  }

  static async create(data: UserInput) {
    await this.createTable();

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password)
       VALUES (gen_random_uuid(), $1, $2, $3)
       RETURNING id, name, email`,
      [data.name, data.email, data.password]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string) {
    await this.createTable();

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return result.rows[0];
  }

  static async saveResetToken(email: string, token: string, expiry: Date) {
    await pool.query(
      `
      UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3
    `,
      [token, expiry, email]
    );
  }

  static async findByResetToken(token: string) {
    const res = await pool.query(`SELECT * FROM users WHERE reset_token = $1`, [
      token,
    ]);
    return res.rows[0];
  }

  static async updatePassword(email: string, newPassword: string) {
    await pool.query(
      `
      UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2
    `,
      [newPassword, email]
    );
  }
}

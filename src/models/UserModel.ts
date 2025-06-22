import { pool } from "../db/client";
import { UserInput } from "../schemas/user.schema";

export class UserModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name STRING NOT NULL,
        email STRING UNIQUE NOT NULL,
        password STRING NOT NULL,
        created_at TIMESTAMP DEFAULT current_timestamp()
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
}

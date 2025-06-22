import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { pool }  from "../db/client";

dotenv.config();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const redirectGoogle = (req: Request, res: Response) => {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });

  res.redirect(authUrl);
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const { email, name, sub: googleId } = payload;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let user = result.rows[0];

    if (!user) {
        console.log({ email, name, googleId });
      const insertResult = await pool.query(
        "INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING *",
        [email, name, googleId]
      );
      user = insertResult.rows[0];
    }

    console.log("Usuário autenticado:", user);


    res.redirect("http://localhost:3000/");
  } catch (error) {
    console.error("Erro ao processar o callback do Google:", error);
    res.status(500).json({ error: "Erro ao processar o login com Google" });
  }
};

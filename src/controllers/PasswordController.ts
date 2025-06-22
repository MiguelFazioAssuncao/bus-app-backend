import { Request, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import { UserModel } from "../models/UserModel";
import { hashPassword } from "../auth/hash";
import { sendResetEmail } from "../utils/email";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});

export class PasswordController {
    
  static async forgotPassword(req: Request, res: Response) {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { email } = parsed.data;
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60);

    await UserModel.saveResetToken(email, token, expiry);
    await sendResetEmail(email, token);

    res.json({ message: "Reset email sent" });
  }

  static async resetPassword(req: Request, res: Response) {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { token, newPassword } = parsed.data;
    const user = await UserModel.findByResetToken(token);

    if (!user || !user.reset_token_expiry || new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await hashPassword(newPassword);
    await UserModel.updatePassword(user.email, hashedPassword);

    res.json({ message: "Password has been reset" });
  }
}

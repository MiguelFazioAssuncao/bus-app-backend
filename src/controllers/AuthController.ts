import { Request, Response } from "express";
import { loginSchema } from "../schemas/user.schema";
import { UserModel } from "../models/UserModel";
import { comparePassword } from "../auth/hash";

export class AuthController {
    
    static async login(req: Request, res: Response) {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }

        const { email, password } = parsed.data;
        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid password" });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            })
    }
}
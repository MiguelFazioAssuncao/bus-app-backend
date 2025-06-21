import { Request, Response } from "express";
import { userSchema } from "../schemas/user.schema";
import { UserModel } from "../models/UserModel";
import { hashPassword } from "../auth/hash";

export class UserController {
    static async register(req: Request, res: Response) {
        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }

        const { name, email, password } = parsed.data;

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });


        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },      
        });
    }
}
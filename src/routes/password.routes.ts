import { Router } from "express";
import { PasswordController } from "../controllers/PasswordController";

const router = Router();

router.post("/forgot", async (req, res) => {
    await PasswordController.forgotPassword(req, res);
});

router.post("/reset", async (req, res) => {
    await PasswordController.resetPassword(req, res);
});


export default router;

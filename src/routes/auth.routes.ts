import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post("/", async (req, res) => {
    await AuthController.login(req, res);
});

export default router;
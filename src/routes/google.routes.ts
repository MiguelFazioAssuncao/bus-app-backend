import { Router } from "express";
import { redirectGoogle, handleGoogleCallback } from "../controllers/AuthGoogleController";

const router = Router();

router.get("/google", async (req, res) => {
    await redirectGoogle(req, res);
});


router.get("/google/callback", async (req, res) => {
    await handleGoogleCallback(req, res);
});

export default router;

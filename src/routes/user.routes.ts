import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.post("/", async (req, res ) => {
    await UserController.register(req, res);
}); 

export default router;

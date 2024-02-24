import express from "express";
import { authControllers } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/regester", authControllers.registerController);
router.post("/login", authControllers.loginController);
router.get("/logout", authControllers.logoutController);

export default router;

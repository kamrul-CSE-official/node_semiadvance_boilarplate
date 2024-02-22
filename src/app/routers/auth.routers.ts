import express from "express";
import {
  loginController,
  regesterController,
} from "../controllers/auth.controllers";

const router = express.Router();

router.post("/regester", regesterController);
router.post("/login", loginController);

export default router;

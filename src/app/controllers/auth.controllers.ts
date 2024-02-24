import { Request, Response } from "express";
import User from "../models/user.model";
import { createAccessToken, createRefreshToken } from "../../utils/jwtToken";
import { authServices } from "../services/auth.service";
import { logger } from "../../shared/logger";

const registerController = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const isAlreadyExist = await User.findOne({ email: userData.email });
    if (isAlreadyExist) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }
    const register = await authServices.registerUser(userData);
    if (!register) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }
    logger.info(`${register.email} successfully registered.`);
    return res
      .status(201)
      .json({ status: "success", message: "Successfully registered" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.isUserExist(email);
    if (!existUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const isMatch = await authServices.login(password, existUser.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid password" });
    }

    logger.info(`${existUser.email} login successfull`);

    const payload = {
      name: existUser.name,
      email: existUser.email,
      img: existUser.img,
      _id: existUser._id,
    };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 200 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken: `Bearer ${accessToken}`,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

export const authControllers = {
  registerController,
  loginController,
  logoutController,
};

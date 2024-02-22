import { Request, Response } from "express";

export const regesterController = (req: Request, res: Response) => {
  console.log("regester");
  res.json({ message: "Ok" });
};

export const loginController = (req: Request, res: Response) => {
  console.log("login");
  res.status(200).json({ message: "login" });
};

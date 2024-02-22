import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";
import envConfig from "../../configs/envConfig";
import { IUser } from "../../types/userTypes";

// Interface for User document
interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  img: { type: String, default: "https://i.ibb.co/bP8sJzJ/user.png" },
  password: { type: String, required: true, minlength: 6 },
});

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(envConfig.bcrypt));

  next();
});

const User = model<IUserDocument>("User", userSchema);
export default User;

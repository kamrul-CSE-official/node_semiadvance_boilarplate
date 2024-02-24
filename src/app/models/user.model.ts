import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import envConfig from "../../configs/envConfig";
import { IUser } from "../../types/userTypes";

// Interface for User document
export interface IUserDocument extends IUser, Document {}

// Interface for User model
interface IUserModel extends Model<IUserDocument> {
  isUserExist(email: string): Promise<IUserDocument | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    img: { type: String, default: "https://i.ibb.co/bP8sJzJ/user.png" },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  const user = this as IUserDocument;
  user.password = await bcrypt.hash(user.password, Number(envConfig.bcrypt));
  next();
});

// Static method to check if user exists
userSchema.statics.isUserExist = async function (
  this: any,
  email: string
): Promise<Pick<IUserDocument, "name" | "img" | "password"> | null> {
  return this.findOne({ email: email }).select("name img password");
};

// Static method to compare passwords
userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

const User = model<IUserDocument, IUserModel>("User", userSchema);

export default User;

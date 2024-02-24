import User, { IUserDocument } from "../models/user.model";

const registerUser = async (userData: IUserDocument) => {
  return await User.create(userData);
};

const login = async (
  inputPassword: string,
  existUserPassword: string
): Promise<boolean> => {
  const isExist = await User.isPasswordMatched(
    inputPassword,
    existUserPassword
  );
  return isExist;
};

export const authServices = {
  registerUser,
  login,
};

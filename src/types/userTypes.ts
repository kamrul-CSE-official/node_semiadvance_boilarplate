export interface IUser {
  name: string;
  email: string;
  gender: string;
  img?: string;
  password: string;
}

export interface IMessage {
  senderId: string | undefined;
  receiverId: string | undefined;
  message: string;
}
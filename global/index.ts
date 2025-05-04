import { Message } from "./helpers";

export interface IUser {
   id: number;
  socketId: string;
  ipAddress: string;
  online?: boolean;
  messages: Message[];
}
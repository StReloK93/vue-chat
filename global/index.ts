import { Message } from "./helpers";

export interface IUser {
  id: number;
  socketId: string;
  ipAddress: string;
  online?: boolean;
  icon?: string;
  color?: string;
  hostname?: string | null;
  messages: Message[];
  typing: boolean
}
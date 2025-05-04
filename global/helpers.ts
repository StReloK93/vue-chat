import type { IUser } from "./index";

export class User implements IUser {
  id: number;
  socketId: string;
  ipAddress: string;
  online: boolean;

  constructor(ipAddress: string, socketId: string, users: IUser[]) {
    this.socketId = socketId;
    this.ipAddress = ipAddress;
    this.id = users.length;
    this.online = true;
  }
}

export class Message {
  id: number;
  from: IUser;
  to?: IUser;
  text: string;
  date: Date;
  toChannel?: string;
  viewusers: IUser[]


  constructor(params: {
    id?: number;
    from: IUser;
    text: string;
    to?: IUser;
    toChannel?: string;
    messages: any[];
  }) {
    const { from, to, toChannel, text, messages } = params;

    // ❗ Custom constraint: faqat bittasi bo‘lishi kerak
    if ((!to && !toChannel) || (to && toChannel)) {
      throw new Error("Either 'to' or 'toChannel' must be set, but not both.");
    }

    this.id = messages.length;
    this.from = from;
    this.text = text;
    this.date = new Date();
    this.to = to;
    this.toChannel = toChannel;
    this.viewusers = [];
  }
}
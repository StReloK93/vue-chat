import type { IUser } from "./index";

export type FileType = 'image' | 'video' | 'text' | 'file' | 'sound';

export class User implements IUser {
  id: number;
  socketId: string;
  ipAddress: string;
  online: boolean;
  messages: Message[];
  typing: boolean
  hostname?: string | null

  constructor(ipAddress: string, socketId: string, users: IUser[], hostname?: string | null) {
    this.socketId = socketId;
    this.ipAddress = ipAddress;
    this.id = users.length;
    this.online = true;
    this.messages = []
    this.typing = false
    this.hostname = hostname
  }
}


export class Message {
  id: number;
  from: string;
  type: FileType
  to?: string;
  files: any[] | null;
  text: string;
  date: Date;
  toChannel?: string;
  viewusers: IUser[]


  constructor(params: {
    id?: number;
    from: string;
    text: string;
    to?: string;
    toChannel?: string;
    messages: any[];
    files: any[];
    type: FileType
  }) {
    const { from, to, toChannel, text, messages, type, files } = params;

    // ❗ Custom constraint: faqat bittasi bo‘lishi kerak
    if ((!to && !toChannel) || (to && toChannel)) {
      throw new Error("Either 'to' or 'toChannel' must be set, but not both.");
    }

    this.id = messages.length;
    this.from = from;
    this.toChannel = toChannel;
    this.to = to;
    this.text = text;
    this.date = new Date();
    this.type = type;
    this.files = files;
    this.viewusers = [];
  }
}
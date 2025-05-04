import io from "./server.js";
import { User, Message } from "../global/helpers.js";
import { cleanIp } from "./helpers.js";
import { IUser } from "../global/index.js";
process.env.TZ = "Asia/Tashkent";

const users: IUser[] = [new User('global', 'global', [])];
const messages: Message[] = [];

io.on("connection", (socket) => {
  const ipAddress = cleanIp(socket.handshake.address);
  const user = users.find((user) => user.ipAddress === ipAddress);

  
  if (user) {
    user.socketId = socket.id;
    var sessionUser = user;
  } else {
    var sessionUser: IUser = new User(ipAddress, socket.id, users);
    users.push(sessionUser);
  }
  
  socket.broadcast.emit("join", sessionUser);

  socket.emit("start", { user: sessionUser, messages, users:  users.filter((currentUser) => user != currentUser) });

  socket.on("message", (text) => {
    const message = new Message({
      from: sessionUser,
      toChannel: "global",
      text: text,
      messages: messages,
    });
    io.emit("message", message);
    messages.push(message);
  });

  socket.on("disconnect", () => {
    const user = users.find((user) => user.ipAddress === ipAddress);
    io.emit("exit", user);
  });
});

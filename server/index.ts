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
    user.online = true
  } else {
    var sessionUser: IUser = new User(ipAddress, socket.id, users);
    users.push(sessionUser);
  }


  socket.broadcast.emit("join", sessionUser);

  socket.emit("start", {
    user: sessionUser,
    messages: messages.filter((message) => {
      const my = message.from == sessionUser.ipAddress
      const forMe = message.to == sessionUser.ipAddress
      const globalChat = message.toChannel == 'global'

      return my || forMe || globalChat
    }),
    users: users.filter((currentUser) => currentUser.ipAddress != ipAddress)
  });

  socket.on("message", ({ message, to }) => {
    const isIpAddress = to.includes('.')
    const recieverUser = users.find((user) => user.ipAddress === to);
    const senderUser = users.find((user) => user.ipAddress === sessionUser.ipAddress);

    const mess = new Message({
      from: sessionUser.ipAddress,
      toChannel: isIpAddress ? null : to,
      to: isIpAddress ? to : null,
      text: message,
      messages: messages,
    });

    if (isIpAddress && (senderUser && recieverUser)) {
      io.to([senderUser.socketId, recieverUser.socketId]).emit("message", mess);
    }
    else {
      io.emit("message", mess);
    }
    messages.push(mess);
  });

  socket.on("disconnect", () => {
    const user = users.find((user) => user.ipAddress === ipAddress);
    if (user) {
      user.online = false
      io.emit("exit", user);
    }
  });
});

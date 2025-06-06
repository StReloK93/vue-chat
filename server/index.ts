import io from "./server.js";
import { User, Message } from "../global/helpers.js";
import { cleanIp } from "./helpers.js";
import { IUser } from "../global/index.js";
import dns from 'node:dns';
import os from 'os';
process.env.TZ = "Asia/Tashkent";

const users: IUser[] = [new User('global', 'global', [])];
const messages: Message[] = [];

io.on("connection", (socket) => {
  const ipAddress = cleanIp(socket.handshake.address);
  const user = users.find((user) => user.ipAddress === ipAddress);
  var sessionUser : IUser

  var hostname: string | null = null


  dns.reverse(ipAddress, (err, hostnames) => {
    if (err) hostname = os.hostname()
    else hostname = hostnames[0]

    if (user) {
      user.socketId = socket.id;
      sessionUser = user;
      user.online = true
    } else {
      sessionUser = new User(ipAddress, socket.id, users, hostname);
      users.push(sessionUser);
    }






    socket.broadcast.emit("join", sessionUser);

    const chats = users.filter((currentUser) => currentUser.ipAddress != ipAddress)

    chats.forEach((currentUser) => {
      const filteredMessages = messages.filter((message) => {
        const isIpAddress = currentUser.ipAddress.includes(".");
        if (isIpAddress) {
          return (
            [message.from, message.to].includes(currentUser.ipAddress) &&
            [message.from, message.to].includes(ipAddress)
          );
        } else {
          return message.toChannel == currentUser.ipAddress;
        }
      });

      currentUser.messages = filteredMessages
    })


    socket.emit("start", {
      user: sessionUser,
      messages: messages.filter((message) => {
        const my = message.from == sessionUser.ipAddress
        const forMe = message.to == sessionUser.ipAddress
        const globalChat = message.toChannel == 'global'

        return my || forMe || globalChat
      }),
      users: chats
    });
  });






  socket.on('visibleMessage', ({ message, user }: { message: Message, user: IUser }) => {
    const currentMessage = messages.find((mess) => mess.id == message.id)
    currentMessage?.viewusers.push(user)
    io.emit('message_readed', { message, user })
  })


  socket.on('typing', ({ from, to }: { from: string, to: string }) => {
    const isIpAddress = to.includes(".");

    if (isIpAddress) {
      const toUser = users.find((user) => user.ipAddress == to)

      if (toUser) io.to([toUser?.socketId]).emit("typing", from);

    }
  })

  socket.on("message", ({ message, to, type, files }) => {
    const isIpAddress = to.includes('.')
    const recieverUser = users.find((user) => user.ipAddress === to);
    const senderUser = users.find((user) => user.ipAddress === sessionUser.ipAddress);

    const mess = new Message({
      from: sessionUser.ipAddress,
      toChannel: isIpAddress ? null : to,
      to: isIpAddress ? to : null,
      text: message,
      messages: messages,
      type: type,
      files: files
      
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

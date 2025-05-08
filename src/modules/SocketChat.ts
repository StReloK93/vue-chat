import { io } from "socket.io-client";
import type { IUser } from "../../global";
import type { Ref } from "vue";
import type { Message } from "../../global/helpers";
import { scrollToLastMessage, getScrollProcent } from "./scrollToEnd";
import { playNotificationSound } from "./messageSound";
import { ref, nextTick } from "vue";
import { useSessionStorage } from "@vueuse/core";

const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']
const icons = ['fa-solid fa-apple-whole', 'fa-solid fa-share-nodes', 'fa-solid fa-comet', 'fa-solid fa-user-secret', 'fa-solid fa-hat-cowboy']


const urlWithoutPort = window.location.hostname;
const dynamicUrlHost = `http://${urlWithoutPort}:3000`;
const socket = io(dynamicUrlHost);

export default function () {
  const localUser = JSON.parse(sessionStorage.getItem("user") as string);
  const users: Ref<IUser[]> = ref([]);
  const user: Ref<IUser> = ref(localUser ? localUser : null);
  const message: Ref<string> = ref("");
  const scrollProcent = ref(0);
  const messagesList = ref([]);

  const activeChat: Ref<string | null> = useSessionStorage('activeChat', null);

  function selectChat(ipAddress: string) {
    activeChat.value = null;
    setTimeout(() => {
      activeChat.value = ipAddress;
      nextTick(() => scrollToLastMessage(messagesList.value.at(-1), false));
    })
  }

  socket.on("start", ({ user: currentUser, users: chats }: { user: IUser, users: IUser[] }) => {
    chats.forEach((currentUser) => {
      currentUser.color = colors[Math.floor(Math.random() * colors.length)]
      currentUser.icon = icons[Math.floor(Math.random() * icons.length)]
    })

    user.value = currentUser;
    users.value = chats;
    nextTick(() => scrollToLastMessage(messagesList.value.at(-1), false));
  });

  socket.on("message_readed", ({ message: currentMessage, user: viewedUser }: { message: Message, user: IUser }) => {

    if (currentMessage.toChannel) {
      const selectedChat = users.value.find((currentUser) => currentUser.ipAddress == currentMessage.toChannel)
      const selectedMessage = selectedChat?.messages.find((message) => currentMessage.id == message.id)
      selectedMessage?.viewusers.push(viewedUser)
    }
    else {

      const myMessage = currentMessage.from == user.value.ipAddress
      const partnerIp = myMessage ? currentMessage.to : currentMessage.from
      const selectedChat = users.value.find((currentUser) => currentUser.ipAddress == partnerIp)
      const selectedMessage = selectedChat?.messages.find((message) => currentMessage.id == message.id)
      selectedMessage?.viewusers.push(viewedUser)

    }

  });

  socket.on("message", async (message: Message) => {
    if (message.toChannel) {
      const selectedChat = users.value.find((currentUser) => currentUser.ipAddress == message.toChannel)
      selectedChat?.messages.push(message)
    }
    else {

      const myMessage = message.from == user.value.ipAddress
      const partnerIp = myMessage ? message.to : message.from
      const selectedChat = users.value.find((currentUser) => currentUser.ipAddress == partnerIp)
      selectedChat?.messages.push(message)

    }

    if (message.from != user.value?.ipAddress) playNotificationSound();
    if (message.from == user.value?.ipAddress || scrollProcent.value == 100) {
      nextTick(() => scrollToLastMessage(messagesList.value.at(-1)));
    }
  });

  function onVisibleMessage(message: Message) {
    const oldReaded = message.viewusers
      .map((viewedUser) => viewedUser.ipAddress)
      .includes(user.value.ipAddress)

    if (oldReaded == false) {
      socket.emit("visibleMessage", { message: message, user: user.value });
    }
  }

  function onScrollChat(event: Event) {
    scrollProcent.value = getScrollProcent(event);
  }

  socket.on("join", (newuser: IUser) => {
    const user = users.value.find(
      (user) => user.ipAddress == newuser.ipAddress
    );
    if (user) user.online = true;
    else users.value.push(newuser);
  });

  socket.on("exit", (disconnect_user: any) => {
    const user = users.value.find(
      (user) => user.ipAddress == disconnect_user.ipAddress
    );
    if (user) user.online = false;
  });

  function writeMessage() {
    if (message.value.trim() == "") return;
    socket.emit("message", {
      message: message.value,
      to: activeChat.value,
    });
    message.value = "";
  }

  function handel(event: any) {
    if (event.shiftKey == false) {
      event.preventDefault();
      writeMessage();
    }
  }

  return {
    scrollProcent,
    user,
    users,
    message,
    activeChat,
    messagesList,
    writeMessage,
    onScrollChat,
    handel,
    selectChat,
    onVisibleMessage,
  };
}

import { io } from "socket.io-client";
import type { IUser } from "../../global";
import type { Ref } from "vue";
import type { Message } from "../../global/helpers";
import { scrollToLastMessage, getScrollProcent } from "./scrollToEnd";
import { playNotificationSound } from "./messageSound";
import { ref, computed, nextTick } from "vue";
const urlWithoutPort = window.location.hostname;
const dynamicUrlHost = `http://${urlWithoutPort}:3000`;
const socket = io(dynamicUrlHost);

export default function () {
  const localUser = JSON.parse(sessionStorage.getItem("user") as string);
  const users: Ref<IUser[]> = ref([]);
  const user: Ref<IUser> = ref(localUser ? localUser : null);
  const message: Ref<string> = ref("");
  const messages: Ref<Message[]> = ref([]);
  const scrollProcent = ref(0);
  const messagesList = ref([]);

  const activeChat: Ref<string | null> = ref("global");

  function selectChat(ipAddress: string) {
    activeChat.value = null;
    activeChat.value = ipAddress;
    nextTick(() => scrollToLastMessage(messagesList.value.at(-1), false));
  }

  socket.on("start", (data) => {
    user.value = data.user;
    messages.value = data.messages;
    users.value = data.users;
    nextTick(() => scrollToLastMessage(messagesList.value.at(-1), false));
  });

  socket.on("message_readed", ({message, user}) => {
    const currentMessage = messages.value.find((mess)=> mess.id == message.id)
    currentMessage?.viewusers.push(user)
  });

  
  // Принятие сообщения от сервера
  socket.on("message", async (message: Message) => {
    if (message.from != user.value?.ipAddress) playNotificationSound();
    messages.value.push(message);
    if (message.from == user.value?.ipAddress || scrollProcent.value == 100) {
      nextTick(() => scrollToLastMessage(messagesList.value.at(-1)));
    }
  });

  function onVisibleMessage(message: Message) {
    const oldReaded = message.viewusers.map((viewedUser) => viewedUser.ipAddress).includes(user.value.ipAddress)

    if(oldReaded == false){
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

  const activeChatMessages = computed(() => {
    const menu = menuUsers.value.find((menu) => menu.user.ipAddress == activeChat.value);

    if (menu) return menu.messages
    else return []
  });

  const menuUsers = computed(() => {
    return users.value.map((childUser) => {
      const filteredMessages = messages.value.filter((message) => {
        const isIpAddress = childUser.ipAddress.includes(".");
        if (isIpAddress) {
          return (
            [message.from, message.to].includes(childUser.ipAddress) &&
            [message.from, message.to].includes(user.value.ipAddress)
          );
        } else {
          return message.toChannel == childUser.ipAddress;
        }
      });

      const issetNewMessage = filteredMessages.filter((message) => message.from != user.value.ipAddress && !message.viewusers.map((viewedUser) => viewedUser.ipAddress).includes(user.value.ipAddress))

      return { user: childUser, messages: filteredMessages, issetNewMessage: issetNewMessage };
    });
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
    messages,
    activeChat,
    activeChatMessages,
    menuUsers,
    messagesList,
    writeMessage,
    onScrollChat,
    handel,
    selectChat,
    onVisibleMessage,
  };
}

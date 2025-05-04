import { io } from "socket.io-client";
import type { IUser } from "../../global";
import type { Ref } from "vue";
import type { Message } from "../../global/helpers";
import { scrollToLastMessage } from "./scrollToEnd";
import { ref, computed, nextTick } from "vue";
const urlWithoutPort = window.location.hostname;
const dynamicUrlHost = `http://${urlWithoutPort}:3000`;
const socket = io(dynamicUrlHost);

export default function (messagesList: any) {
  const localUser = JSON.parse(sessionStorage.getItem("user") as string);
  const users: Ref<IUser[]> = ref([]);
  const user: Ref<IUser> = ref(localUser ? localUser : null);
  const message: Ref<string> = ref("");
  const messages: Ref<Message[]> = ref([]);

  const activeChat: Ref<string> = ref('global')



  socket.on("start", (data) => {
    user.value = data.user;
    messages.value = data.messages;
    data.users.forEach((user: IUser) => user.online = true)
    users.value = data.users;
    console.log(data);
    
    nextTick(() => scrollToLastMessage(messagesList.value.at(-1)));
  });

  // Принятие сообщения от сервера
  socket.on("message", async (message: Message) => {
    messages.value.push(message);
    if (message.from == user.value?.ipAddress)
      nextTick(() => scrollToLastMessage(messagesList.value.at(-1)));
  });

  socket.on("join", (disconnect_user: IUser) => {
    const user = users.value.find((user) => user.ipAddress == disconnect_user.ipAddress)
    if(user) user.online = true;
  });

  socket.on("exit", (disconnect_user: any) => {
    const user = users.value.find((user) => user.ipAddress == disconnect_user.ipAddress)
    if(user) user.online = false;
  });




  const messageContain = computed(() => message.value.trim() == "");

  const activeChatMessages = computed(() => messages.value.filter(((message) => {
    const my = message.from == activeChat.value && user.value.ipAddress == message.to
    const forMe = message.to == activeChat.value && user.value.ipAddress == message.from
    const globalChat = message.toChannel == activeChat.value
    return my || forMe || globalChat
  })));

  function writeMessage() {
    if (message.value.trim() == "") return;
    socket.emit("message", {
      message: message.value,
      to: activeChat.value
    });
    message.value = "";
  }


  function handel(event: any) {
    if (event.shiftKey == false) {
      event.preventDefault();
      writeMessage()
    }
  }




  return {
    user,
    users,
    message,
    messages,
    writeMessage,
    handel,
    messageContain,
    activeChat,
    activeChatMessages
  };
}

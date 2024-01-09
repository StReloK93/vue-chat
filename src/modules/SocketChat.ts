import { io } from 'socket.io-client'
import { ref, onMounted, computed, nextTick } from 'vue'



export default function (messagesList: any, loginInput: any) {

    const localUser = JSON.parse(sessionStorage.getItem('user') as string)

    const socket = io('http://192.168.14.92:3000')
    const user: any = ref(localUser ? localUser : null)
    const message = ref("")
    const messages: any = ref([])


    if (user.value) socket.emit('connectId', user.value.id)
    // Отправка сообщения на сервер
    socket.on('connectId', (selected) => {
        if (selected == null) {
            sessionStorage.removeItem('user')
            user.value = null
        }
        else user.value = selected

    })

    socket.on('getMessages', async (mess) => {
        messages.value = mess
        nextTick(() => {
            scrollToLastMessage(messagesList.value.at(-1))
        })
    } )

    const messageContain = computed(() => message.value.trim() == "")

    function writeMessage() {
        if (message.value.trim() == "") return
        socket.emit('message', message.value)
        message.value = ""
    }

    // Принятие сообщения от сервера
    socket.on('message', async (message) => {
        messages.value.push(message)
        if (message.user.id == user.value?.id) nextTick(() => {
            scrollToLastMessage(messagesList.value.at(-1))
        })
    })

    const scrollToLastMessage = (lastMessageRef: any) => {
        if(lastMessageRef) lastMessageRef.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest"
        })
    }

    function loginToChat() {
        socket.emit('login', { login: loginInput.value.value })
    }


    socket.on('login', (data) => {
        console.log('Siz chatga ulandiz sizni malumotlariz:', data)
        sessionStorage.setItem('user', JSON.stringify(data))
        user.value = data
    })

    function handel(event: any) {
        if (event.shiftKey) {
            // Если нажат Shift + Enter, добавляем новую строку
            const cursorPosition = event.target.selectionStart;
            const newValue = message.value.substring(0, cursorPosition) + '\n' + message.value.substring(event.target.selectionEnd)
            message.value = newValue;

            // Перемещаем курсор в новую строку
            event.target.selectionStart = cursorPosition + 1;
            event.target.selectionEnd = cursorPosition + 1;
        }
        else writeMessage()
    }

    return { user, message, messages, writeMessage, loginToChat, handel , messageContain}
}
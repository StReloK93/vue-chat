import io from './server.js'
process.env.TZ = 'Asia/Tashkent'

const users = []
const messages = []
class User {
    constructor(login, socketId) {
        this.socketId = socketId
        this.login = login
        this.id = users.length
    }
}
class Message {
    constructor(user, text) {
        this.id = messages.length
        this.user = user
        this.text = text
        this.date = new Date(),
        this.viewusers = [] 
    }
}


io.on('connection', (socket) => {
    const socketId = socket.id;
    var sessionUser
    io.emit('getMessages', messages)

    socket.on('login', ({ login }) => {

        const user = new User(login, socketId)
        sessionUser = user
        users.push(user)
        // Отправка сообщения обратно клиенту
        socket.emit('login', user);

    })

    socket.on('connectId', (id) => {
        const user = users.find((user) => user.id == id)
        sessionUser = user
        socket.emit('connectId', user)
    })


    // Обработчик для принятия сообщений от клиента
    socket.on('message', (data) => {
        const message = new Message(sessionUser, data)
        io.emit('message', message)
        messages.push(message)
    });

    // socket.on('disconnect', (socket) => {
    //     console.log('user disconnected');
    // });
});






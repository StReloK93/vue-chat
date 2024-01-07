import io from './server.js'
const users = []

class User {
    constructor(login, socketId) {
        this.socketId = socketId
        this.login = login
        this.id = users.length
    }
}


io.on('connection', (socket) => {
    const socketId = socket.id;
    var sessionUser

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
        console.log(sessionUser)
        io.emit('message', { user: sessionUser, text: data });
    });

    // socket.on('disconnect', (socket) => {
    //     console.log('user disconnected');
    // });
});






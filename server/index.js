import io from './server.js'
const users = []
process.env.TZ = 'Asia/Tashkent'
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

        io.emit('message', { user: sessionUser, text: data, date: new Date() })
    });

    // socket.on('disconnect', (socket) => {
    //     console.log('user disconnected');
    // });
});






import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

const app = express();
app.use(cors());
const server = http.createServer(app);



const port = 3000
server.listen(port, () => console.log(`http://localhost:${port}`))

export default new Server(server, {
    cors: {
        origin: [
            'http://192.168.14.92:5173', // Первый IP-адрес
            'http://192.168.1.18:5173', // Второй IP-адрес и т.д.
            'http://localhost:5173', // Второй IP-адрес и т.д.
            // Добавьте сколько угодно IP-адресов, которым разрешен доступ
        ],// Укажите адрес вашего клиентского Vite-сервера
        methods: ['GET', 'POST']
    }
});
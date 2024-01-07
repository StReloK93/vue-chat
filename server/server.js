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
        origin: 'http://localhost:5173', // Укажите адрес вашего клиентского Vite-сервера
        methods: ['GET', 'POST']
    }
});
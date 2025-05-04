import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { Server } from "socket.io";
import { getIpAddresses } from "./helpers";
const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = http.createServer(app);

const port = 3000;
server.listen(port, () => console.log(...getIpAddresses(port)));

export default new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

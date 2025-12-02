const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Cho phép client từ localhost:5173 kết nối
    methods: ["GET", "POST"],
  },
});

let chatHistory = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("chatHistory", chatHistory);

  socket.on("sendMessage", (message) => {
    chatHistory.push(message);
    io.emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

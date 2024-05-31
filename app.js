const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");

const { formatMSG } = require("./utils/formatMSG");

const app = express();

app.use(cors());

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const SocketIO = socketIO(server, { cors: { origin: "*" } });

// Run when client-server connection is established
SocketIO.on("connection", (socket) => {
  console.log("Client connected");

  const BOT_NAME = "Bot Su";
  const BOT_MSG = "Welcome to SuChat.io";
  socket.emit("message", formatMSG(BOT_NAME, BOT_MSG));

  // Listen for join room / send join room message except for the user itself
  socket.broadcast.emit(
    "message",
    formatMSG(BOT_NAME, "Anonymous has joined the chat")
  );

  // User Leave the chat
  socket.on("disconnect", () => {
    SocketIO.emit(
      "message",
      formatMSG(BOT_NAME, "Anonymous has left the chat")
    );
  });
});

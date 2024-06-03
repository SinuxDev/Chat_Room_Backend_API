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

const users = [];

const addUser = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

const disconnectUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Run when client-server connection is established
SocketIO.on("connection", (socket) => {
  console.log("Client connected");

  const Chat_Name = "Su_Bot";
  const Chat_MSG = "Welcome to SuChat.io";

  // Listen for join room
  socket.on("join_room", ({ username, room }) => {
    const user = addUser(socket.id, username, room);
    socket.join(user.room);

    // Welcome joined user
    socket.emit("message", formatMSG(Chat_Name, Chat_MSG));

    // Listen for join room / send join room message except for the user itself
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMSG(Chat_Name, user.username + " joined the chat")
      );

    // Listen for chat message
    socket.on("chat_message", (msg) => {
      //send message to the same room
      SocketIO.to(user.room).emit("message", formatMSG(user.username, msg));
    });
  });

  // User Leave the chat
  socket.on("disconnect", () => {
    const user = disconnectUser(socket.id);

    if (user) {
      SocketIO.to(user.room).emit(
        "message",
        formatMSG(Chat_Name, user.username + " leave the chat")
      );
    }
  });
});

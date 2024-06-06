const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { formatMSG } = require("./utils/formatMSG");
const MessageController = require("./controller/MessageController");

const app = express();
app.use(cors());

app.get("/room/:roomName", MessageController.getOldMessage);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const SocketIO = socketIO(server, { cors: { origin: "*" } });

const { addUser, disconnectUser, getSameUsers } = require("./utils/user");

const Message = require("./models/Message");

// Run when client-server connection is established
SocketIO.on("connection", (socket) => {
  console.log("Client connected");

  const Chat_Name = "Su_Bot";
  const Chat_MSG = "Welcome to SuChat.io";

  // Listen for when user join room
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

    // Listen for chat message from users
    socket.on("chat_message", (msg) => {
      //send message to the same room
      SocketIO.to(user.room).emit("message", formatMSG(user.username, msg));

      //Save Message to MongoDB
      Message.create({
        username: user.username,
        room: user.room,
        message: msg,
      });
    });

    //Send Room Users when Join Room
    SocketIO.to(user.room).emit("room_users", getSameUsers(user.room));
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

    //Send Room Users when Leave Room
    SocketIO.to(user.room).emit("room_users", getSameUsers(user.room));
  });
});

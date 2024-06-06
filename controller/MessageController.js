const Message = require("../models/Message");
const OPEN_ROOMS = ["react", "node", "javascript"];

exports.getOldMessage = (req, res, next) => {
  const { roomName } = req.params;
  if (!OPEN_ROOMS.includes(roomName)) {
    return res.status(403).json("Room not found");
  }

  Message.find({ room: roomName })
    .select("username message sent_at")
    .then((messages) => {
      res.status(200).json(messages);
    });
};

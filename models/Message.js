const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sent_time: {
    type: Date,
    default: Date.now(),
  },
  room: {
    type: String,
    required: true,
  },
});

module.exports = model("Message", MessageSchema);

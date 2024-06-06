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
  sent_at: {
    type: String,
    default: Date.now(),
  },
  room: {
    type: String,
    required: true,
  },
});

module.exports = model("Message", MessageSchema);

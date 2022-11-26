const { Schema, model } = require("mongoose");

const canvasSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
    unique: true,
  },
});

const Canvas = model("canvas", canvasSchema);

module.exports = Canvas;

require("dotenv").config();
require("./db");
const express = require("express");
const http = require("http");
const cors = require("cors");
const Canvas = require("./models/canvas");

const port = 3003;
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000" },
});

let users = [];

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));

app.post("/save", async (req, res) => {
  const { room, content } = req.body;
  const canvas = await Canvas.findOne({room: room}).exec();
  if (!canvas){
    const newCanvas = new Canvas({room, content});
    await newCanvas.save();
  }
});

io.on("connection", onConnection);

function onConnection(socket) {
  socket.on("access", (args) => {
    socket.join(args.room);
    const user = { id: socket.id, ...args };
    users.push(user);
    const roomUsers = users.filter((u) => u.room === args.room);
    socket.to(args.room).emit("userconnected", { user, users: roomUsers });
    socket.on("todraw", (data) => {
      socket.to(args.room).emit("todraw", data);
    });
  });

  socket.on("disconnect", () => {
    const user = users.find((u) => u.id === socket.id);
    if (user) {
      users = users.filter((u) => u.id !== user.id);
      const roomUsers = users.filter((u) => u.room === user.room);
      socket.to(user.room).emit("userdisconect", { user, users: roomUsers });
    }
  });
}
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

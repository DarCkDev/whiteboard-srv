require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const port = process.env.PORT | 3001;
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000" },
});

let users = [];

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  //res.sendFile(__dirname + "/index.html");
});

/*io.on("connection", onConnection);
function onConnection(socket) {
  socket.on("access", (args) => {
    users.push({ id: socket.id, ...args });
    console.log(args);
  });
  socket.on("todraw", (data) => {
    socket.broadcast.emit("todraw", data);
  });
}*/
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
    console.log("Connected", args, socket.id);
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

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
    users.push({ id: socket.id, ...args });
    socket.on("todraw", (data) => {
      socket.to(args.room).emit("todraw", data);
    });
  });
}
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

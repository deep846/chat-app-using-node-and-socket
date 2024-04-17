const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const bw = require("bad-words");
const dbw = require("profanity-hindi");
const messagegnt = require("./utils/messages");
const filterUser = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT;

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath)); // this will represent the home page always

io.on("connection", (socket) => {
  socket.on("join", (username, room, callback) => {
    const { error, user } = filterUser.addUser({
      id: socket.id,
      username,
      room,
    });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit(
      "sent",
      messagegnt.generateMessage(
        `Welcome ${user.username} to ${user.room} Room`
      )
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "sent",
        messagegnt.generateMessage(`${user.username} has joined the room`)
      );
    io.to(user.room).emit(
      "activeuser",
      filterUser.getUsersInRoom(room.trim().toLowerCase())
    );

    callback();

    socket.on("disconnect", () => {
      const user = filterUser.removeUser(socket.id);

      if (user) {
        socket.broadcast
          .to(user.room)
          .emit(
            "sent",
            messagegnt.generateMessage(`${user.username} has left the room`)
          );

        io.to(user.room).emit(
          "activeuser",
          filterUser.getUsersInRoom(room.trim().toLowerCase())
        );
      }
    });

    socket.on("sent", (message, callback) => {
      const user = filterUser.getUser(socket.id);
      const filter = new bw();

      let badWords = [
        "bokachoda",
        "magi",
        "chinal",
        "bainchod",
        "chudai",
        "maanga",
        "bhatar",
        "chuda",
        "Gaar",
        "Gar",
        "baal",
        "bara",
        "bal",
        "chud",
        "choda",
      ];
      
      dbw.addWords(badWords);

      if (
        filter.isProfane(message) ||
        dbw.isMessageDirty(message.toString().trim())
      ) {
        return callback("Profane is not allowed");
      }

      io.to(user.room).emit(
        "sent",
        messagegnt.generateMessage(message.toString().trim(), username)
      );
      callback("message Delivered");
    });
    socket.on("geo", (lat, lon, callback) => {
      const user = filterUser.getUser(socket.id);
      io.to(user.room).emit("geo", messagegnt.geoMessage(lat, lon, username));
      callback("Location shared");
    });
  });
});

server.listen(port, (req, res) => {
  console.log("lilstening on port: " + port);
});

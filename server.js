const express = require("express");
const httpModule = require("http");
const { Server } = require("socket.io");
const path = require("path");

let PORT = process.env.PORT || 3000;

function startServer(port) {
  const app = express();
  const http = httpModule.createServer(app);
  const io = new Server(http);

  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("drawing", (data) => {
      socket.broadcast.emit("drawing", data);
    });

    socket.on("clearCanvas", () => {
      io.emit("clearCanvas");
    });
  });

  http.listen(port)
    .on("listening", () => {
      console.log(`🎉 Official Website Running: http://localhost:${port}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`⚠️ Port ${port} in use, trying ${port + 1}...`);
        PORT++;
        startServer(PORT);
      } else {
        console.error(err);
      }
    });
}

startServer(PORT);

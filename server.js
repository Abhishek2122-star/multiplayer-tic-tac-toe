const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // Serve HTML/CSS/JS from public folder

io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);

    // Join a game room
    socket.on("joinGame", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);

        // If 2 players are in the room, start game
        const playersInRoom = io.sockets.adapter.rooms.get(room);
        if (playersInRoom.size === 2) {
            io.to(room).emit("startGame");
        }
    });

    // Handle moves
    socket.on("makeMove", (data) => {
        io.to(data.room).emit("moveMade", data);
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

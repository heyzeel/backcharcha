const express = require("express");
require('dotenv').config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require('cors');
const path = require('path')

connectDB();
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://main--0charcha.netlify.app"
    );
})


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, (req, res) => {
    console.log("server is running")
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'https://main--0charcha.netlify.app'
    }
})

io.on("connection", (socket) => {
    console.log("connected to socke.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);

        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room " + room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat user not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });

    })
})


const express = require("express");
const connectDB = require("./config/db");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const cronHelper = require("./utils/cron")

const app = express();
const server = http.createServer(app);
connectDB();

app.use(bodyParser.json());
app.use(cors({origin: "*"}));
app.options("*", cors());
app.use("/api", require("./routes/api"));

cronHelper.init();

const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("joinRoom", ({ supportRequestId }) => {
    socket.join(supportRequestId);
    console.log(`User joined room: ${supportRequestId}`);
  });

  socket.on("message", ({ supportRequestId, message, senderId }) => {
    // Emit the message to the specific room based on support request ID
    io.to(supportRequestId).emit("message", { message, senderId, timestamp: new Date() });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

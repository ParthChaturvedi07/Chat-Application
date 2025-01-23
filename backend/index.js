const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
env.config();
const app = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow credentials (cookies)
  })
);

// MongoDB Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the Database");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: process.env.NODE_ENV === "development", httpOnly: true }, // Secure cookies in production
  })
);

// Routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("Socket.IO: Connection established");

  socket.on("setup", (user) => {
    if (user?.data?._id) {
      socket.join(user.data._id);
      console.log("Server: User joined:", user.data._id);
      socket.emit("connected");
    } else {
      console.error("Setup failed: User ID not found in data");
    }
  });

  socket.on("join chat", (room) => {
    if (room) {
      socket.join(room);
      console.log("User joined room:", room);
    } else {
      console.error("Join chat failed: Room not specified");
    }
  });

  socket.on("new message", (newMessageStatus) => {
    const chat = newMessageStatus?.chat;
    if (!chat?.users) {
      return console.error("Chat users not defined in newMessageStatus");
    }

    chat.users.forEach((user) => {
      if (user._id !== newMessageStatus?.sender?._id) {
        socket.to(user._id).emit("message received", newMessageStatus);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket.IO: User disconnected");
  });
});

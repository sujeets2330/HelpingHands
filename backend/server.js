require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http"); 
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const donorRoutes = require("./routes/donorRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 9090;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// View Engine (if required)
app.set("view engine", "ejs");

// Public Routes (Frontend Pages)
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.render("index"));
app.get("/thank", (req, res) => res.render("thank"));
app.get("/track", (req, res) => res.render("track"));
app.get("/hello",(req,res) => res.render("hello"));

//  Create HTTP Server for WebSockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

//  Store io instance in app
app.set("io", io);

//  Handle WebSocket Connections
io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// API Routes
app.use(authRoutes);
app.use(donorRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

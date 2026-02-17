// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");
// const ejsMate = require("ejs-mate");

// // Import Local Modules
// const connectDB = require("./config/db");
// const donorRoutes = require("./routes/donorRoutes");
// const authRoutes = require("./routes/authRoutes");
// const errorHandler = require("./middleware/errorHandler");
 

// // Initialize App
// const app = express();
// const PORT = process.env.PORT || 9090;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// // View Engine
// app.engine('ejs', ejsMate);
// app.set("view engine", "ejs");
// app.set("views",path.join(__dirname,"views"));

// // Static Files
// app.use(express.static(path.join(__dirname, "public")));

// // Frontend Routes
// app.get("/",(req, res) => res.render("index"));
// app.get("/thank", (req, res) => res.render("thank"));
// app.get("/track", (req, res) => res.render("track"));
// app.get("/hello", (req, res) => res.render("hello"));

// // New Donation Category Routes (EJS pages)
// app.get("/donate/clothes", (req, res) => res.render("donate/clothes"));
// app.get("/donate/footwear", (req, res) => res.render("donate/footwear"));
// app.get("/donate/fund", (req, res) => res.render("donate/fund"));
// app.get("/donate/gadgets", (req, res) => res.render("donate/gadgets"));
// app.get("/donate/stationery", (req, res) => res.render("donate/stationary"));
// app.get("/donate/food", (req, res) => res.render("donate/food"));

// // API Routes
// app.use(authRoutes);
// app.use(donorRoutes);
 

// // Error Handler
// app.use(errorHandler);

// // Create HTTP Server for Socket.IO
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173", credentials: true },
// });

// // WebSocket Setup
// io.on("connection", (socket) => {
//   console.log("New WebSocket connection:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Make io globally available
// app.set("io", io);

// // Start Server
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const ejsMate = require("ejs-mate");

const connectDB = require("./config/db");
const donorRoutes = require("./routes/donorRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 9090;

// ======================
// Database
// ======================
connectDB();

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ======================
// View Engine (EJS)
// ======================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files for EJS (CSS, images, JS)
app.use(express.static(path.join(__dirname, "public")));

// ======================
// ROOT + EJS ROUTES
// ======================
app.get("/", (req, res) => {
  res.render("index"); //  backend/views/index.ejs
});

app.get("/thank", (req, res) => res.render("thank"));
app.get("/track", (req, res) => res.render("track"));
app.get("/hello", (req, res) => res.render("hello"));

app.get("/donate/clothes", (req, res) => res.render("donate/clothes"));
app.get("/donate/footwear", (req, res) => res.render("donate/footwear"));
app.get("/donate/fund", (req, res) => res.render("donate/fund"));
app.get("/donate/gadgets", (req, res) => res.render("donate/gadgets"));
app.get("/donate/stationery", (req, res) => res.render("donate/stationary"));
app.get("/donate/food", (req, res) => res.render("donate/food"));

// ======================
// API ROUTES
// ======================
app.use(authRoutes);
app.use(donorRoutes);

// ======================
// Error Handler
// ======================
app.use(errorHandler);

// ======================
// SOCKET.IO (Render supports this)
// ======================
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log(" Socket disconnected:", socket.id);
  });
});

app.set("io", io);

// ======================
// START SERVER
// ======================
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

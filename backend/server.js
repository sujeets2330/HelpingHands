require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const ejsMate = require("ejs-mate");

// Import Local Modules
const connectDB = require("./config/db");
const donorRoutes = require("./routes/donorRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

// Initialize App
const app = express();

// Connect to MongoDB
connectDB();

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://helpinghands.vercel.app" // frontend URL
    ],
    credentials: true,
  })
);

// ======================
// View Engine (EJS)
// ======================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ======================
// Static Files
// ======================
app.use(express.static(path.join(__dirname, "public")));

// ======================
// Frontend Pages (EJS)
// ======================
app.get("/", (req, res) => res.render("index"));
app.get("/thank", (req, res) => res.render("thank"));
app.get("/track", (req, res) => res.render("track"));
app.get("/hello", (req, res) => res.render("hello"));

// Donation Category Pages
app.get("/donate/clothes", (req, res) => res.render("donate/clothes"));
app.get("/donate/footwear", (req, res) => res.render("donate/footwear"));
app.get("/donate/fund", (req, res) => res.render("donate/fund"));
app.get("/donate/gadgets", (req, res) => res.render("donate/gadgets"));
app.get("/donate/stationery", (req, res) => res.render("donate/stationary"));
app.get("/donate/food", (req, res) => res.render("donate/food"));

// ======================
// API Routes
// ======================
app.use(authRoutes);
app.use(donorRoutes);

// ======================
// Error Handler
// ======================
app.use(errorHandler);

// ======================
// EXPORT APP (VERY IMPORTANT FOR VERCEL)
// ======================
module.exports = app;

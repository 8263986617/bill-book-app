const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const billRoutes = require("./routes/billRoutes");
const companyRoutes = require("./routes/companyRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:");
    console.log(err);
  });

// Home Route
app.get("/", (req, res) => {
  res.send("Bill Book API Running");
});

// Test Route
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "API Working Successfully",
  });
});

// Bill Routes
app.use("/api/bills", billRoutes);

// Company Routes
app.use("/api/company", companyRoutes);

// Error Handling Middleware (Must be last)
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
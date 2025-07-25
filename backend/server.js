require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const authRoutes = require("./routes/auth");
const restaurantRoutes = require("./routes/restaurants");
const dishRoutes = require("./routes/dishes");
const ratingRoutes = require("./routes/ratings");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/health/detailed", async (req, res) => {
  const healthCheck = {
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: "disconnected",
      message: "Database connection unavailable",
    },
  };

  try {
    // Check database connection
    if (mongoose.connection.readyState === 1) {
      healthCheck.database.status = "connected";
      healthCheck.database.message = "Database connection is healthy";
    } else {
      healthCheck.status = "DEGRADED";
      healthCheck.database.message = "Database connection is not ready";
    }
  } catch (error) {
    healthCheck.status = "ERROR";
    healthCheck.database.status = "error";
    healthCheck.database.message = error.message;
  }

  const statusCode = healthCheck.status === "OK" ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/ratings", ratingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
  }

  // Handle MongoDB CastError (invalid ID)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Handle other types of errors
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong on the server!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

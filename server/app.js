const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();
const port = 3000;

connectDB();

const userRoutes = require("./routes/users");
const hotelRoutes = require("./routes/hotels");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`健康检查: http://localhost:${port}/api/health`);
  console.log(`用户API: http://localhost:${port}/api/users`);
  console.log(`酒店API: http://localhost:${port}/api/hotels`);
});

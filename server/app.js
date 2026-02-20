const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

const connectDB = require("./config/db");

connectDB();

const userRouter = require("./routes/users");
const hotelRouter = require("./routes/hotels");

// 配置 CORS
app.use(cors({
  origin: "http://localhost:5173", // 前端开发服务器地址
  credentials: true,
}));

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/hotels", hotelRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`注册接口: POST http://localhost:${port}/api/users/register`);
});

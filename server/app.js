const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const path = require("path");

const connectDB = require("./config/db");

connectDB();

const userRouter = require("./routes/users");
const hotelRouter = require("./routes/hotels");
const weappRouter = require("./routes/weapp");

// 配置 CORS
const allowOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:10086",
  "http://127.0.0.1:10086",
  "http://198.18.0.1:10086",
]);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 提供上传的图片访问
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/weapp", weappRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`注册接口: POST http://localhost:${port}/api/users/register`);
});

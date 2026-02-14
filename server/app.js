const express = require("express");
const app = express();
const port = 3000;

const connectDB = require("./config/db");

connectDB();

const userRouter = require("./routes/users");
const hotelRouter = require("./routes/hotels");

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

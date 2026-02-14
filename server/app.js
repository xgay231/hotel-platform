const express = require("express");
const app = express();
const port = 3000;

const userRoutes = require("./routes/users");
const hotelRoutes = require("./routes/hotels");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`用户API: http://localhost:${port}/api/users`);
  console.log(`酒店API: http://localhost:${port}/api/hotels`);
});

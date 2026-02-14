const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("酒店列表页面");
});

router.get("/:id", (req, res) => {
  const hotelId = req.params.id;
  res.send(`酒店详情页面，酒店ID: ${hotelId}`);
});

router.post("/", (req, res) => {
  res.send("创建新酒店");
});

router.put("/:id", (req, res) => {
  const hotelId = req.params.id;
  res.send(`更新酒店信息，酒店ID: ${hotelId}`);
});

router.delete("/:id", (req, res) => {
  const hotelId = req.params.id;
  res.send(`删除酒店，酒店ID: ${hotelId}`);
});

module.exports = router;

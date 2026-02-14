const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("用户列表页面");
});

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`用户详情页面，用户ID: ${userId}`);
});

router.post("/", (req, res) => {
  res.send("创建新用户");
});

router.put("/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`更新用户信息，用户ID: ${userId}`);
});

router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`删除用户，用户ID: ${userId}`);
});

module.exports = router;

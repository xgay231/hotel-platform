const express = require("express");
const router = express.Router();

// Step 01: 路由骨架占位，Step 02 再切换到控制器
router.get("/banners", (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "weapp banners route placeholder",
  });
});

router.get("/hotels", (req, res) => {
  res.json({
    success: true,
    data: {
      list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      hasMore: false,
    },
    message: "weapp hotels route placeholder",
  });
});

router.get("/hotels/:id", (req, res) => {
  res.json({
    success: true,
    data: {
      hotel: null,
      rooms: [],
    },
    message: "weapp hotel detail route placeholder",
  });
});

module.exports = router;

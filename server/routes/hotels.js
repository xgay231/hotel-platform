const express = require("express");
const router = express.Router();
const { getHotels, createHotel } = require("../controllers/hotelController");

/**
 * @route   POST /api/hotels
 * @desc    创建酒店（上传酒店详情）
 * @access  Public
 */
router.post("/", createHotel);

/**
 * @route   GET /api/hotels
 * @desc    获取酒店列表
 * @access  Public
 */
router.get("/", getHotels);

/**
 * @route   GET /api/hotels/:id
 * @desc    获取酒店详情（含房型）
 * @access  Public
 */

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

const express = require("express");
const router = express.Router();
const {
  getHotels,
  createHotel,
  getHotelById,
  updateHotel,
  createRoom,
  updateRoom,
  deleteRoom,
  getBanners,
  createBanner,
  publishHotel,
  offlineHotel,
  onlineHotel,
  approveHotel,
  rejectHotel,
} = require("../controllers/hotelController");

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
router.get("/:id", getHotelById);

/**
 * @route   PUT /api/hotels/:id
 * @desc    更新酒店
 * @access  Public
 */
router.put("/:id", updateHotel);

/**
 * @route   POST /api/hotels/:id/rooms
 * @desc    创建房型（上传房型信息）
 * @access  Public
 */
router.post("/:id/rooms", createRoom);

/**
 * @route   PUT /api/hotels/:id/rooms/:roomId
 * @desc    更新房型
 * @access  Public
 */
router.put("/:id/rooms/:roomId", updateRoom);

/**
 * @route   DELETE /api/hotels/:id/rooms/:roomId
 * @desc    删除房型
 * @access  Public
 */
router.delete("/:id/rooms/:roomId", deleteRoom);

/**
 * @route   GET /api/hotels/banners/list
 * @desc    获取轮播图列表
 * @access  Public
 */
router.get("/banners/list", getBanners);

/**
 * @route   POST /api/banners
 * @desc    创建 Banner（上传 Banner）
 * @access  Public
 */
router.post("/banners", createBanner);

/**
 * @route   PUT /api/hotels/:id/publish
 * @desc    发布酒店
 * @access  Public
 */
router.put("/:id/publish", publishHotel);

/**
 * @route   PUT /api/hotels/:id/offline
 * @desc    下线酒店
 * @access  Public
 */
router.put("/:id/offline", offlineHotel);

/**
 * @route   PUT /api/hotels/:id/online
 * @desc    上线酒店
 * @access  Public
 */
router.put("/:id/online", onlineHotel);

/**
 * @route   PUT /api/hotels/:id/approve
 * @desc    审核通过酒店
 * @access  Public
 */
router.put("/:id/approve", approveHotel);

/**
 * @route   PUT /api/hotels/:id/reject
 * @desc    审核不通过酒店
 * @access  Public
 */
router.put("/:id/reject", rejectHotel);

module.exports = router;

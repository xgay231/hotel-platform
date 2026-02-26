const express = require("express");
const router = express.Router();
const {
  getWeappBanners,
  getWeappHotels,
  getWeappHotelDetail,
} = require("../controllers/weappController");

router.get("/banners", getWeappBanners);
router.get("/hotels", getWeappHotels);
router.get("/hotels/:id", getWeappHotelDetail);

module.exports = router;

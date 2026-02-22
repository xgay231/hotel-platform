const Hotel = require("../models/Hotel");

/**
 * 获取酒店列表
 * @route GET /api/hotels
 */
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取酒店列表失败",
      error: error.message,
    });
  }
};

/**
 * 创建酒店（上传酒店详情）
 * @route POST /api/hotels
 */
const createHotel = async (req, res) => {
  try {
    const {
      hotel_id,
      name_cn,
      name_en,
      star,
      address,
      open_time,
      cover_image,
      desc,
      min_price,
      quick_flag,
      province,
      city,
      image_url,
    } = req.body;

    // 检查 hotel_id 是否已存在
    const existingHotel = await Hotel.findOne({ hotel_id });
    if (existingHotel) {
      return res.status(400).json({
        success: false,
        message: "酒店ID已存在",
      });
    }

    const hotel = await Hotel.create({
      hotel_id,
      name_cn,
      name_en,
      star,
      address,
      open_time,
      cover_image,
      desc,
      min_price,
      quick_flag,
      province,
      city,
      image_url,
    });

    res.status(201).json({
      success: true,
      message: "酒店创建成功",
      data: hotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "创建酒店失败",
      error: error.message,
    });
  }
};

module.exports = {
  getHotels,
  createHotel,
};

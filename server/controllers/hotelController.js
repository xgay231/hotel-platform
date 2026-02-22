const Hotel = require("../models/Hotel");
const HotelRoom = require("../models/HotelRoom");

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

/**
 * 获取酒店详情（含房型）
 * @route GET /api/hotels/:id
 */
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    const rooms = await HotelRoom.find({ hotel_id: id }).sort({ price: 1 });

    res.json({
      success: true,
      data: {
        hotel,
        rooms,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取酒店详情失败",
      error: error.message,
    });
  }
};

/**
 * 创建房型（上传房型信息）
 * @route POST /api/hotels/:id/rooms
 */
const createRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_id, name, price, desc } = req.body;

    // 检查酒店是否存在
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 检查 room_id 是否已存在
    const existingRoom = await HotelRoom.findOne({ room_id });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "房型ID已存在",
      });
    }

    const room = await HotelRoom.create({
      room_id,
      hotel_id: id,
      name,
      price,
      desc,
    });

    res.status(201).json({
      success: true,
      message: "房型创建成功",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "创建房型失败",
      error: error.message,
    });
  }
};

module.exports = {
  getHotels,
  createHotel,
  getHotelById,
  createRoom,
};

const Hotel = require("../models/Hotel");
const HotelRoom = require("../models/HotelRoom");
const Banner = require("../models/Banner");

/**
 * 获取酒店列表
 * @route GET /api/hotels
 * @query page - 页码，默认 1
 * @query pageSize - 每页数量，默认 15
 * @query merchant_id - 商户 ID（可选）
 */
const getHotels = async (req, res) => {
  try {
    const { page = 1, pageSize = 15, merchant_id } = req.query;
    const skip = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    // 构建查询条件
    const query = {};
    if (merchant_id) {
      query.merchant_id = merchant_id;
    }

    // 查询总数
    const total = await Hotel.countDocuments(query);

    // 分页查询
    const hotels = await Hotel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        list: hotels,
        total,
        page: parseInt(page),
        pageSize: limit,
      },
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
      merchant_id,
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
      online_status,
      tags,
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
      merchant_id,
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
      online_status,
      tags,
      // audit_status 默认为 '审核中'
      // publish_status 默认为 '未发布'
      // rating, review_count, favorite_count 默认为 0
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
    const { room_id, name, price, desc, tags } = req.body;

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
      tags,
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

/**
 * 获取轮播图列表
 * @route GET /api/banners
 */
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取轮播图列表失败",
      error: error.message,
    });
  }
};

/**
 * 创建 Banner（上传 Banner）
 * @route POST /api/banners
 */
const createBanner = async (req, res) => {
  try {
    const { id, image_url, hotel_id } = req.body;

    // 检查 Banner ID 是否已存在
    const existingBanner = await Banner.findOne({ id });
    if (existingBanner) {
      return res.status(400).json({
        success: false,
        message: "Banner ID已存在",
      });
    }

    // 检查酒店是否存在
    const hotel = await Hotel.findOne({ hotel_id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    const banner = await Banner.create({
      id,
      image_url,
      hotel_id,
    });

    res.status(201).json({
      success: true,
      message: "Banner创建成功",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "创建Banner失败",
      error: error.message,
    });
  }
};

module.exports = {
  getHotels,
  createHotel,
  getHotelById,
  createRoom,
  getBanners,
  createBanner,
};

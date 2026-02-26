const mongoose = require("mongoose");
const Hotel = require("../models/Hotel");
const HotelRoom = require("../models/HotelRoom");
const Banner = require("../models/Banner");
const User = require("../models/User");
const upload = require("../config/upload");

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

    // 获取所有商户 ID
    const merchantIds = [...new Set(hotels.map((h) => h.merchant_id))];

    // 批量查询商户信息
    const merchants = await User.find({ userid: { $in: merchantIds } });
    const merchantMap = new Map(merchants.map((m) => [m.userid, m.username]));

    // 为每个酒店添加商户名称
    const hotelsWithMerchant = hotels.map((hotel) => ({
      ...hotel.toObject(),
      merchant_name: merchantMap.get(hotel.merchant_id) || "",
    }));

    res.json({
      success: true,
      data: {
        list: hotelsWithMerchant,
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
    console.log("[createHotel] 请求体:", req.body);
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
      province,
      city,
      image_url,
      tags,
    } = req.body;

    console.log("[createHotel] 解构后的字段:", {
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
      province,
      city,
      image_url,
      tags,
    });

    // 检查 hotel_id 是否已存在
    const existingHotel = await Hotel.findOne({ hotel_id });
    if (existingHotel) {
      console.log("[createHotel] 酒店ID已存在:", hotel_id);
      return res.status(400).json({
        success: false,
        message: "酒店ID已存在",
      });
    }

    console.log("[createHotel] 准备创建酒店...");
    console.log(
      "[createHotel] MongoDB 连接状态:",
      mongoose.connection.readyState
    );

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
      province,
      city,
      image_url,
      tags,
      // audit_status 默认为 '审核中'
      // publish_status 默认为 '未发布'
      // rating, review_count, favorite_count 默认为 0
    });

    console.log("[createHotel] 酒店创建成功:", hotel);
    res.status(201).json({
      success: true,
      message: "酒店创建成功",
      data: hotel,
    });
  } catch (error) {
    console.error("[createHotel] 创建酒店失败:", error);
    console.error("[createHotel] 错误详情:", {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors,
    });
    res.status(500).json({
      success: false,
      message: "创建酒店失败",
      error: error.message,
      details: error.errors,
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
 * 更新酒店
 * @route PUT /api/hotels/:id
 */
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_cn,
      name_en,
      star,
      address,
      open_time,
      cover_image,
      desc,
      min_price,
      province,
      city,
      image_url,
      tags,
    } = req.body;

    console.log("[updateHotel] 更新酒店:", id);
    console.log("[updateHotel] 更新数据:", req.body);

    // 查找酒店
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 更新字段
    if (name_cn !== undefined) hotel.name_cn = name_cn;
    if (name_en !== undefined) hotel.name_en = name_en;
    if (star !== undefined) hotel.star = star;
    if (address !== undefined) hotel.address = address;
    if (open_time !== undefined) hotel.open_time = open_time;
    if (cover_image !== undefined) hotel.cover_image = cover_image;
    if (desc !== undefined) hotel.desc = desc;
    if (min_price !== undefined) hotel.min_price = min_price;
    if (province !== undefined) hotel.province = province;
    if (city !== undefined) hotel.city = city;
    if (image_url !== undefined) hotel.image_url = image_url;
    if (tags !== undefined) hotel.tags = tags;

    // 酒店信息修改后，重置审核状态为"审核中"，发布状态为"未发布"
    hotel.audit_status = "审核中";
    hotel.audit_reason = undefined;
    hotel.publish_status = "未发布";

    await hotel.save();

    console.log("[updateHotel] 酒店更新成功:", hotel);
    res.json({
      success: true,
      message: "酒店更新成功",
      data: hotel,
    });
  } catch (error) {
    console.error("[updateHotel] 更新酒店失败:", error);
    res.status(500).json({
      success: false,
      message: "更新酒店失败",
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
    const { name, price, desc, tags } = req.body;

    console.log("[createRoom] 请求体:", req.body);

    // 检查酒店是否存在
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 自动生成 room_id
    const room_id = `room-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const room = await HotelRoom.create({
      room_id,
      hotel_id: id,
      name,
      price,
      desc,
      tags,
    });

    console.log("[createRoom] 房型创建成功:", room);
    res.status(201).json({
      success: true,
      message: "房型创建成功",
      data: room,
    });
  } catch (error) {
    console.error("[createRoom] 创建房型失败:", error);
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

/**
 * 更新房型
 * @route PUT /api/hotels/:id/rooms/:roomId
 */
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.params;
    const { name, price, desc, tags } = req.body;

    console.log("[updateRoom] 更新房型:", { hotelId: id, roomId });
    console.log("[updateRoom] 更新数据:", req.body);

    // 检查酒店是否存在
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 查找房型
    const room = await HotelRoom.findOne({ room_id: roomId, hotel_id: id });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "房型不存在",
      });
    }

    // 更新字段
    if (name !== undefined) room.name = name;
    if (price !== undefined) room.price = price;
    if (desc !== undefined) room.desc = desc;
    if (tags !== undefined) room.tags = tags;

    await room.save();

    console.log("[updateRoom] 房型更新成功:", room);
    res.json({
      success: true,
      message: "房型更新成功",
      data: room,
    });
  } catch (error) {
    console.error("[updateRoom] 更新房型失败:", error);
    res.status(500).json({
      success: false,
      message: "更新房型失败",
      error: error.message,
    });
  }
};

/**
 * 删除房型
 * @route DELETE /api/hotels/:id/rooms/:roomId
 */
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.params;

    console.log("[deleteRoom] 删除房型:", { hotelId: id, roomId });

    // 检查酒店是否存在
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 查找并删除房型
    const room = await HotelRoom.findOneAndDelete({
      room_id: roomId,
      hotel_id: id,
    });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "房型不存在",
      });
    }

    console.log("[deleteRoom] 房型删除成功:", room);
    res.json({
      success: true,
      message: "房型删除成功",
    });
  } catch (error) {
    console.error("[deleteRoom] 删除房型失败:", error);
    res.status(500).json({
      success: false,
      message: "删除房型失败",
      error: error.message,
    });
  }
};

/**
 * 发布酒店
 * @route PUT /api/hotels/:id/publish
 * @desc 只有审核通过且未发布的酒店可以发布
 */
const publishHotel = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("[publishHotel] 发布酒店:", id);

    // 查找酒店
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 检查审核状态
    if (hotel.audit_status !== "通过") {
      return res.status(400).json({
        success: false,
        message: "只有审核通过的酒店才能发布",
      });
    }

    // 检查发布状态
    if (hotel.publish_status === "已发布") {
      return res.status(400).json({
        success: false,
        message: "酒店已发布，无需重复发布",
      });
    }

    // 更新发布状态
    hotel.publish_status = "已发布";
    await hotel.save();

    console.log("[publishHotel] 酒店发布成功:", hotel);
    res.json({
      success: true,
      message: "酒店发布成功",
      data: hotel,
    });
  } catch (error) {
    console.error("[publishHotel] 发布酒店失败:", error);
    res.status(500).json({
      success: false,
      message: "发布酒店失败",
      error: error.message,
    });
  }
};

/**
 * 下线酒店
 * @route PUT /api/hotels/:id/offline
 * @desc 只有已发布的酒店可以下线
 */
const offlineHotel = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("[offlineHotel] 下线酒店:", id);

    // 查找酒店
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 检查发布状态
    if (hotel.publish_status !== "已发布") {
      return res.status(400).json({
        success: false,
        message: "只有已发布的酒店才能下线",
      });
    }

    // 更新发布状态
    hotel.publish_status = "已下线";
    await hotel.save();

    console.log("[offlineHotel] 酒店下线成功:", hotel);
    res.json({
      success: true,
      message: "酒店下线成功",
      data: hotel,
    });
  } catch (error) {
    console.error("[offlineHotel] 下线酒店失败:", error);
    res.status(500).json({
      success: false,
      message: "下线酒店失败",
      error: error.message,
    });
  }
};

/**
 * 上线酒店
 * @route PUT /api/hotels/:id/online
 * @desc 只有已下线的酒店可以上线
 */
const onlineHotel = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("[onlineHotel] 上线酒店:", id);

    // 查找酒店
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 检查发布状态
    if (hotel.publish_status !== "已下线") {
      return res.status(400).json({
        success: false,
        message: "只有已下线的酒店才能上线",
      });
    }

    // 更新发布状态
    hotel.publish_status = "已发布";
    await hotel.save();

    console.log("[onlineHotel] 酒店上线成功:", hotel);
    res.json({
      success: true,
      message: "酒店上线成功",
      data: hotel,
    });
  } catch (error) {
    console.error("[onlineHotel] 上线酒店失败:", error);
    res.status(500).json({
      success: false,
      message: "上线酒店失败",
      error: error.message,
    });
  }
};

/**
 * 审核通过酒店
 * @route PUT /api/hotels/:id/approve
 * @desc 审核中或不通过的酒店可以审核通过
 */
const approveHotel = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("[approveHotel] 审核通过酒店:", id);

    // 查找酒店
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 检查审核状态：允许审核中或不通过的酒店进行审核通过
    if (hotel.audit_status !== "审核中" && hotel.audit_status !== "不通过") {
      return res.status(400).json({
        success: false,
        message: "只有审核中或不通过的酒店可以审核通过",
      });
    }

    // 更新审核状态
    hotel.audit_status = "通过";
    hotel.audit_reason = undefined; // 清空不通过原因
    await hotel.save();

    console.log("[approveHotel] 酒店审核通过成功:", hotel);
    res.json({
      success: true,
      message: "酒店审核通过",
      data: hotel,
    });
  } catch (error) {
    console.error("[approveHotel] 审核通过酒店失败:", error);
    res.status(500).json({
      success: false,
      message: "审核通过酒店失败",
      error: error.message,
    });
  }
};

/**
 * 审核不通过酒店
 * @route PUT /api/hotels/:id/reject
 * @desc 审核中或已通过的酒店可以审核不通过，需填写原因
 */
const rejectHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log("[rejectHotel] 审核不通过酒店:", id);
    console.log("[rejectHotel] 不通过原因:", reason);

    // 验证原因是否填写
    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "请填写不通过原因",
      });
    }

    // 查找酒店
    const hotel = await Hotel.findOne({ hotel_id: id });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "酒店不存在",
      });
    }

    // 检查审核状态：允许审核中或已通过的酒店进行不通过操作
    if (hotel.audit_status !== "审核中" && hotel.audit_status !== "通过") {
      return res.status(400).json({
        success: false,
        message: "只有审核中或已通过的酒店可以审核不通过",
      });
    }

    // 更新审核状态
    hotel.audit_status = "不通过";
    hotel.audit_reason = reason.trim();

    // 如果酒店之前已发布，需要将发布状态重置为未发布
    if (
      hotel.publish_status === "已发布" ||
      hotel.publish_status === "已下线"
    ) {
      hotel.publish_status = "未发布";
    }

    await hotel.save();

    console.log("[rejectHotel] 酒店审核不通过成功:", hotel);
    res.json({
      success: true,
      message: "酒店审核不通过",
      data: hotel,
    });
  } catch (error) {
    console.error("[rejectHotel] 审核不通过酒店失败:", error);
    res.status(500).json({
      success: false,
      message: "审核不通过酒店失败",
      error: error.message,
    });
  }
};

/**
 * 上传酒店图片
 * @route POST /api/hotels/upload
 * @desc 上传单张或多张酒店图片
 */
const uploadHotelImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "请选择要上传的图片",
      });
    }

    // 构建图片访问 URL
    const imageUrl = `/uploads/${req.file.filename}`;

    console.log("[uploadHotelImage] 图片上传成功:", imageUrl);

    res.json({
      success: true,
      message: "图片上传成功",
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("[uploadHotelImage] 图片上传失败:", error);
    res.status(500).json({
      success: false,
      message: "图片上传失败",
      error: error.message,
    });
  }
};

/**
 * 上传多张酒店图片
 * @route POST /api/hotels/upload/multiple
 * @desc 上传多张酒店图片
 */
const uploadHotelImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "请选择要上传的图片",
      });
    }

    // 构建图片访问 URL 列表
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

    console.log("[uploadHotelImages] 图片上传成功:", imageUrls);

    res.json({
      success: true,
      message: "图片上传成功",
      data: {
        urls: imageUrls,
        count: imageUrls.length,
      },
    });
  } catch (error) {
    console.error("[uploadHotelImages] 图片上传失败:", error);
    res.status(500).json({
      success: false,
      message: "图片上传失败",
      error: error.message,
    });
  }
};

module.exports = {
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
  uploadHotelImage,
  uploadHotelImages,
  upload,
};

const Banner = require("../models/Banner");
const Hotel = require("../models/Hotel");
const HotelRoom = require("../models/HotelRoom");

const sendSuccess = (res, data, message = "ok", status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

const sendError = (
  res,
  message = "请求失败",
  errorCode = "WEAPP_API_ERROR",
  status = 500
) => {
  return res.status(status).json({
    success: false,
    message,
    errorCode,
  });
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
};

const getWeappBanners = async (req, res) => {
  try {
    const banners = await Banner.find({})
      .sort({ createdAt: -1 })
      .select("id image_url hotel_id")
      .lean();

    return sendSuccess(res, banners, "获取 Banner 成功");
  } catch (error) {
    return sendError(res, "获取 Banner 失败", "WEAPP_BANNERS_FAILED");
  }
};

const getWeappHotels = async (req, res) => {
  try {
    const {
      province,
      city,
      keyword,
      minPrice,
      maxPrice,
      starLevel,
      tags,
      sortBy,
    } = req.query;
    const pageRaw = parseInt(req.query.page, 10);
    const pageSizeRaw = parseInt(req.query.pageSize, 10);
    const page = Number.isNaN(pageRaw) ? 1 : pageRaw;
    const pageSize = Number.isNaN(pageSizeRaw) ? 10 : pageSizeRaw;

    if (page < 1 || page > 1000) {
      return sendError(
        res,
        "page 必须在 1-1000 之间",
        "WEAPP_INVALID_PAGE",
        400
      );
    }

    if (pageSize < 1 || pageSize > 50) {
      return sendError(
        res,
        "pageSize 必须在 1-50 之间",
        "WEAPP_INVALID_PAGE_SIZE",
        400
      );
    }

    const query = {
      audit_status: "通过",
      publish_status: "已发布",
    };

    if (province) {
      query.province = province;
    }

    if (city) {
      query.city = city;
    }

    if (keyword) {
      query.name_cn = { $regex: keyword, $options: "i" };
    }

    const minPriceNum = toNumber(minPrice);
    const maxPriceNum = toNumber(maxPrice);
    const starLevelNum = toNumber(starLevel);

    if (Number.isNaN(minPriceNum) || Number.isNaN(maxPriceNum)) {
      return sendError(
        res,
        "minPrice/maxPrice 必须为数字",
        "WEAPP_INVALID_PRICE_RANGE",
        400
      );
    }

    if (
      minPriceNum !== null &&
      maxPriceNum !== null &&
      minPriceNum > maxPriceNum
    ) {
      return sendError(
        res,
        "minPrice 不能大于 maxPrice",
        "WEAPP_INVALID_PRICE_RANGE",
        400
      );
    }

    if (minPriceNum !== null || maxPriceNum !== null) {
      query.min_price = {};
      if (minPriceNum !== null) {
        query.min_price.$gte = minPriceNum;
      }
      if (maxPriceNum !== null) {
        query.min_price.$lte = maxPriceNum;
      }
    }

    if (starLevelNum !== null) {
      if (
        !Number.isInteger(starLevelNum) ||
        starLevelNum < 1 ||
        starLevelNum > 5
      ) {
        return sendError(
          res,
          "starLevel 必须为 1-5 的整数",
          "WEAPP_INVALID_STAR_LEVEL",
          400
        );
      }
      query.star = starLevelNum;
    }

    if (tags) {
      const tagList = String(tags)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tagList.length > 0) {
        query.tags = { $in: tagList };
      }
    }

    const sortMap = {
      priceAsc: { min_price: 1, createdAt: -1 },
      priceDesc: { min_price: -1, createdAt: -1 },
      ratingDesc: { rating: -1, createdAt: -1 },
    };
    const sort = sortMap[sortBy] || { createdAt: -1 };

    const total = await Hotel.countDocuments(query);
    const skip = (page - 1) * pageSize;

    const list = await Hotel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .select("hotel_id name_cn star address min_price cover_image tags rating")
      .lean();

    const hasMore = page * pageSize < total;

    return sendSuccess(
      res,
      {
        list,
        total,
        page,
        pageSize,
        hasMore,
      },
      "获取酒店列表成功"
    );
  } catch (error) {
    return sendError(res, "获取酒店列表失败", "WEAPP_HOTELS_FAILED");
  }
};

const getWeappHotelDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findOne({
      hotel_id: id,
      audit_status: "通过",
      publish_status: "已发布",
    })
      .select(
        "hotel_id name_cn name_en star address open_time cover_image desc facilities tags"
      )
      .lean();

    if (!hotel) {
      return sendError(res, "酒店不存在", "WEAPP_HOTEL_NOT_FOUND", 404);
    }

    const rooms = await HotelRoom.find({ hotel_id: id })
      .sort({ price: 1 })
      .select("room_id name price desc tags")
      .lean();

    return sendSuccess(
      res,
      {
        hotel,
        rooms,
      },
      "获取酒店详情成功"
    );
  } catch (error) {
    return sendError(res, "获取酒店详情失败", "WEAPP_HOTEL_DETAIL_FAILED");
  }
};

module.exports = {
  sendSuccess,
  sendError,
  getWeappBanners,
  getWeappHotels,
  getWeappHotelDetail,
};

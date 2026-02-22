const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name_cn: {
      type: String,
      required: true,
      trim: true,
    },
    name_en: {
      type: String,
      required: true,
      trim: true,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    open_time: {
      type: String,
      required: true,
      trim: true,
    },
    cover_image: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    min_price: {
      type: Number,
      required: true,
      min: 0,
    },
    quick_flag: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 添加索引优化查询性能
hotelSchema.index({ province: 1, city: 1 });
hotelSchema.index({ min_price: 1 });

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;

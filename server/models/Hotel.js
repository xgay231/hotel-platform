const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    merchant_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
      required: false,
      trim: true,
      default: "",
    },
    desc: {
      type: String,
      required: false,
      trim: true,
    },
    min_price: {
      type: Number,
      required: true,
      min: 0,
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
    images: {
      type: [String],
      required: false,
      default: [],
    },
    audit_status: {
      type: String,
      enum: ["审核中", "通过", "不通过"],
      default: "审核中",
    },
    audit_reason: {
      type: String,
      trim: true,
    },
    publish_status: {
      type: String,
      enum: ["已发布", "未发布", "已下线"],
      default: "未发布",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    review_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    favorite_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// 添加索引优化查询性能
hotelSchema.index({ province: 1, city: 1 });
hotelSchema.index({ min_price: 1 });
hotelSchema.index({ audit_status: 1 });
hotelSchema.index({ publish_status: 1 });

// weapp 查询优化索引（Step 10）
hotelSchema.index({ publish_status: 1, audit_status: 1, province: 1, city: 1 });
hotelSchema.index({ min_price: 1, star: 1, rating: -1 });

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;

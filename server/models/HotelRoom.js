const mongoose = require("mongoose");

const hotelRoomSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hotel_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

hotelRoomSchema.index({ price: 1 });

// weapp 详情页房型查询索引（Step 10）
hotelRoomSchema.index({ hotel_id: 1, price: 1 });

const HotelRoom = mongoose.model("HotelRoom", hotelRoomSchema);

module.exports = HotelRoom;

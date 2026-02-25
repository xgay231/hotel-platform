const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "merchant"],
      default: "user",
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;

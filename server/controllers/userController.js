const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userid: uuidv4(), // 自动生成 UUID
      username,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        userid: user.userid,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "账号或密码错误" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "账号或密码错误" });
    }

    const token = jwt.sign(
      {
        userid: user.userid, // 使用 userid
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "mysecretkey",
      {
        expiresIn: "24h",
      }
    );

    res.json({
      message: "登录成功",
      token,
      user: {
        userid: user.userid,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "请先登录" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");

    const user = await User.findOne({ userid: decoded.userid }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(401).json({ message: "登录已过期或无效" });
  }
};

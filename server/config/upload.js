const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 确保 uploads 目录存在
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名: 时间戳-随机数.扩展名
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "hotel-" + uniqueSuffix + ext);
  },
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 只允许图片文件
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("只允许上传图片文件 (jpeg, jpg, png, webp, gif)"));
  }
};

// 创建 multer 实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制文件大小为 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;

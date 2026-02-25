const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "请先登录" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    // decoded 包含: { userid, username, role }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "登录已过期或无效，请重新登录" });
  }
};

module.exports = auth;

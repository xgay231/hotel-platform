/**
 * 修复 User 模型索引问题
 * 删除旧的 user_id_1 索引
 */

const mongoose = require("mongoose");

async function fixUserIndex() {
  try {
    // 连接数据库
    await mongoose.connect("mongodb://localhost:27017/hotel_demo");
    console.log("MongoDB Connected");

    // 获取 User 集合
    const db = mongoose.connection.db;
    const collection = db.collection("users");

    // 查看当前所有索引
    console.log("\n当前索引:");
    const indexes = await collection.indexes();
    indexes.forEach((idx) => {
      console.log(`- ${idx.name}:`, idx.key);
    });

    // 删除旧的 user_id_1 索引
    console.log("\n删除旧索引 user_id_1...");
    try {
      await collection.dropIndex("user_id_1");
      console.log("✓ 成功删除索引 user_id_1");
    } catch (err) {
      if (err.code === 27) {
        console.log("✓ 索引 user_id_1 不存在，无需删除");
      } else {
        console.error("✗ 删除索引失败:", err.message);
      }
    }

    // 查看删除后的索引
    console.log("\n删除后的索引:");
    const newIndexes = await collection.indexes();
    newIndexes.forEach((idx) => {
      console.log(`- ${idx.name}:`, idx.key);
    });

    console.log("\n✓ 索引修复完成！");
  } catch (error) {
    console.error("错误:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n数据库连接已关闭");
  }
}

fixUserIndex();

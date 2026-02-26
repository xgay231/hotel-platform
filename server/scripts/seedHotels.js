const mongoose = require("mongoose");
const Hotel = require("../models/Hotel");
const connectDB = require("../config/db");

// 用户ID列表
const merchantIds = [
  "476192c3-ec1b-436b-88a5-30036ffa8897",
  "c2e88243-37d1-4585-9b79-5e339097e8d5",
  "259e6ca8-60eb-47bb-9680-b2bde9af37b5",
];

// 酒店数据模板
const hotelTemplates = [
  {
    name_cn: "豪华商务酒店",
    name_en: "Luxury Business Hotel",
    star: 5,
    min_price: 800,
  },
  {
    name_cn: "精品度假酒店",
    name_en: "Boutique Resort Hotel",
    star: 4,
    min_price: 500,
  },
  {
    name_cn: "舒适快捷酒店",
    name_en: "Comfort Express Hotel",
    star: 3,
    min_price: 200,
  },
  {
    name_cn: "高端会议酒店",
    name_en: "Premium Conference Hotel",
    star: 5,
    min_price: 1200,
  },
];

// 城市数据
const cities = [
  { province: "北京市", city: "北京", address: "朝阳区建国路88号" },
  { province: "上海市", city: "上海", address: "浦东新区陆家嘴环路100号" },
  { province: "广东省", city: "广州", address: "天河区天河路389号" },
  { province: "广东省", city: "深圳", address: "福田区深南大道6008号" },
  { province: "浙江省", city: "杭州", address: "西湖区西湖大道1号" },
  { province: "江苏省", city: "南京", address: "鼓楼区中山路1号" },
  { province: "四川省", city: "成都", address: "锦江区春熙路99号" },
  { province: "湖北省", city: "武汉", address: "江汉区中山大道618号" },
  { province: "陕西省", city: "西安", address: "雁塔区雁塔南路1号" },
  { province: "重庆市", city: "重庆", address: "渝中区解放碑步行街1号" },
  { province: "天津市", city: "天津", address: "和平区南京路88号" },
  { province: "福建省", city: "厦门", address: "思明区环岛南路1号" },
];

// 生成UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 生成酒店数据
function generateHotels() {
  const hotels = [];
  let cityIndex = 0;

  merchantIds.forEach((merchantId, merchantIndex) => {
    hotelTemplates.forEach((template, templateIndex) => {
      const cityData = cities[cityIndex % cities.length];
      const hotelIndex =
        merchantIndex * hotelTemplates.length + templateIndex + 1;

      hotels.push({
        hotel_id: generateUUID(),
        merchant_id: merchantId,
        name_cn: `${cityData.city}${template.name_cn} ${hotelIndex}`,
        name_en: `${template.name_en} ${hotelIndex}`,
        star: template.star,
        address: cityData.address,
        open_time: "2020-01-01",
        cover_image: "",
        desc: `位于${cityData.city}市中心的${template.name_cn}，交通便利，设施齐全，是您商务出行和休闲度假的理想选择。`,
        min_price: template.min_price,
        province: cityData.province,
        city: cityData.city,
        image_url: "",
        tags: ["免费WiFi", "免费停车", "24小时前台", "空调"],
        // audit_status 默认为 '审核中'
        // publish_status 默认为 '未发布'
        // rating, review_count, favorite_count 默认为 0
      });

      cityIndex++;
    });
  });

  return hotels;
}

// 批量插入酒店
async function seedHotels() {
  try {
    console.log("开始连接数据库...");
    await connectDB();

    console.log("生成测试酒店数据...");
    const hotels = generateHotels();
    console.log(`共生成 ${hotels.length} 家酒店数据`);

    console.log("开始批量插入酒店...");
    const result = await Hotel.insertMany(hotels);
    console.log(`成功插入 ${result.length} 家酒店`);

    // 按商户分组显示
    console.log("\n=== 按商户分组统计 ===");
    merchantIds.forEach((merchantId) => {
      const count = result.filter((h) => h.merchant_id === merchantId).length;
      console.log(`商户 ${merchantId}: ${count} 家酒店`);
    });

    console.log("\n=== 酒店列表 ===");
    result.forEach((hotel, index) => {
      console.log(
        `${index + 1}. [${hotel.merchant_id}] ${hotel.name_cn} (${
          hotel.city
        }) - ${hotel.star}星 - ¥${hotel.min_price}`
      );
    });

    console.log("\n批量创建酒店完成！");
  } catch (error) {
    console.error("批量创建酒店失败:", error);
    if (error.code === 11000) {
      console.error("错误原因: 酒店ID已存在，请先清理现有数据");
    }
  } finally {
    await mongoose.disconnect();
    console.log("数据库连接已关闭");
  }
}

// 执行脚本
seedHotels();

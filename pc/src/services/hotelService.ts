/**
 * 酒店服务层
 * 提供酒店相关的 API 调用和 Mock 数据
 */

import type {
  Hotel,
  HotelListParams,
  HotelListResponse,
  RoomType,
} from "../types";
import { request } from "./api";

// ==================== Mock 数据 ====================

/**
 * 生成 Mock 酒店数据
 */
const generateMockHotels = (): Hotel[] => {
  const hotels: Hotel[] = [];
  const auditStatuses: Hotel["auditStatus"][] = [
    "pending",
    "approved",
    "rejected",
  ];
  const publishStatuses: Hotel["publishStatus"][] = [
    "draft",
    "published",
    "offline",
  ];
  const provinces = [
    "北京市",
    "上海市",
    "广东省",
    "浙江省",
    "江苏省",
    "四川省",
    "云南省",
    "海南省",
  ];
  const cities: Record<string, string[]> = {
    北京市: ["北京市"],
    上海市: ["上海市"],
    广东省: ["广州市", "深圳市", "珠海市", "东莞市"],
    浙江省: ["杭州市", "宁波市", "温州市", "绍兴市"],
    江苏省: ["南京市", "苏州市", "无锡市", "常州市"],
    四川省: ["成都市", "绵阳市", "乐山市", "峨眉山市"],
    云南省: ["昆明市", "大理市", "丽江市", "西双版纳"],
    海南省: ["海口市", "三亚市", "琼海市"],
  };

  for (let i = 1; i <= 25; i++) {
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const cityList = cities[province];
    const city = cityList[Math.floor(Math.random() * cityList.length)];
    const auditStatus =
      auditStatuses[Math.floor(Math.random() * auditStatuses.length)];

    // 发布状态逻辑：只有审核通过的才能发布
    let publishStatus: Hotel["publishStatus"] = "draft";
    if (auditStatus === "approved") {
      publishStatus = publishStatuses[Math.floor(Math.random() * 2)];
    }

    hotels.push({
      id: `hotel-${i.toString().padStart(3, "0")}`,
      merchantId: "merchant-001", // 当前商户 ID
      merchantName: "测试商户",
      // 基本信息
      name: `${city.replace("市", "")}豪华酒店${i}号`,
      nameEn: `Grand Hotel ${i}`,
      star: (Math.floor(Math.random() * 3) + 3) as 3 | 4 | 5, // 3-5星
      province,
      city,
      address: `${province}${city}中心区商业街${i}号`,
      // 价格与时间
      minPrice: Math.floor(Math.random() * 500) + 200,
      openTime: "09:00",
      // 图片相关
      coverImage: `https://picsum.photos/seed/hotel${i}cover/800/600`,
      images: [
        `https://picsum.photos/seed/hotel${i}a/800/600`,
        `https://picsum.photos/seed/hotel${i}b/800/600`,
      ],
      // 描述与标签
      description: `这是一家位于${city}市中心的豪华酒店，交通便利，设施完善。`,
      tags: ["免费WiFi", "停车场", "游泳池", "健身房"],
      // 设施
      facilities: [
        { id: "f1", name: "免费WiFi" },
        { id: "f2", name: "停车场" },
        { id: "f3", name: "游泳池" },
        { id: "f4", name: "健身房" },
      ],
      // 审核与发布状态
      auditStatus,
      publishStatus,
      auditReason:
        auditStatus === "rejected"
          ? "酒店信息不完整，请补充房型信息后重新提交。"
          : undefined,
      // 统计数据
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
      reviewCount: Math.floor(Math.random() * 100),
      favoriteCount: Math.floor(Math.random() * 50),
      // 时间戳
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  return hotels;
};

// Mock 酒店数据
const mockHotels = generateMockHotels();

// ==================== 字段映射 ====================

/**
 * 后端审核状态映射到前端
 */
const mapAuditStatus = (status: string): Hotel["auditStatus"] => {
  const statusMap: Record<string, Hotel["auditStatus"]> = {
    审核中: "pending",
    通过: "approved",
    不通过: "rejected",
  };
  return statusMap[status] || "pending";
};

/**
 * 前端审核状态映射到后端
 */
const mapAuditStatusToBackend = (status: Hotel["auditStatus"]): string => {
  const statusMap: Record<Hotel["auditStatus"], string> = {
    pending: "审核中",
    approved: "通过",
    rejected: "不通过",
  };
  return statusMap[status] || "审核中";
};

/**
 * 后端发布状态映射到前端
 */
const mapPublishStatus = (status: string): Hotel["publishStatus"] => {
  const statusMap: Record<string, Hotel["publishStatus"]> = {
    未发布: "draft",
    已发布: "published",
    已下线: "offline",
  };
  return statusMap[status] || "draft";
};

/**
 * 前端发布状态映射到后端
 */
const mapPublishStatusToBackend = (status: Hotel["publishStatus"]): string => {
  const statusMap: Record<Hotel["publishStatus"], string> = {
    draft: "未发布",
    published: "已发布",
    offline: "已下线",
  };
  return statusMap[status] || "未发布";
};

/**
 * 后端酒店数据映射到前端
 */
export const mapHotelFromBackend = (backendHotel: any): Hotel => {
  return {
    // 标识字段
    id: backendHotel.hotel_id,
    merchantId: backendHotel.merchant_id,
    merchantName: backendHotel.merchant_name || "",
    // 基本信息
    name: backendHotel.name_cn,
    nameEn: backendHotel.name_en || "",
    star: backendHotel.star,
    province: backendHotel.province,
    city: backendHotel.city,
    address: backendHotel.address,
    // 价格与时间
    minPrice: backendHotel.min_price || 0,
    openTime: backendHotel.open_time || "",
    // 图片相关
    coverImage: backendHotel.cover_image || "",
    images: Array.isArray(backendHotel.images) ? backendHotel.images : [],
    // 描述与标签
    description: backendHotel.desc || "",
    tags: backendHotel.tags || [],
    // 设施
    facilities: [], // 后端暂无设施数据
    // 审核与发布状态
    auditStatus: mapAuditStatus(backendHotel.audit_status),
    publishStatus: mapPublishStatus(backendHotel.publish_status),
    auditReason: backendHotel.audit_reason || "",
    // 统计数据
    rating: backendHotel.rating || 0,
    reviewCount: backendHotel.review_count || 0,
    favoriteCount: backendHotel.favorite_count || 0,
    // 时间戳
    createdAt: backendHotel.createdAt,
    updatedAt: backendHotel.updatedAt,
  };
};

/**
 * 前端酒店数据映射到后端
 */
const mapHotelToBackend = (frontendHotel: Partial<Hotel>): any => {
  return {
    hotel_id: frontendHotel.id || `hotel-${Date.now()}`,
    merchant_id: frontendHotel.merchantId,
    // 基本信息
    name_cn: frontendHotel.name,
    name_en: frontendHotel.nameEn || frontendHotel.name || "",
    star: frontendHotel.star,
    province: frontendHotel.province,
    city: frontendHotel.city,
    address: frontendHotel.address,
    // 价格与时间
    min_price: frontendHotel.minPrice || 0,
    open_time: frontendHotel.openTime || "",
    // 图片相关
    cover_image: frontendHotel.coverImage || "",
    images: Array.isArray(frontendHotel.images) ? frontendHotel.images : [],
    // 描述与标签
    desc: frontendHotel.description || "",
    tags: frontendHotel.tags || [],
    // 审核与发布状态（仅用于创建时，更新时由后端处理）
    audit_status: frontendHotel.auditStatus
      ? mapAuditStatusToBackend(frontendHotel.auditStatus)
      : "审核中",
    audit_reason: frontendHotel.auditReason || "",
    publish_status: frontendHotel.publishStatus
      ? mapPublishStatusToBackend(frontendHotel.publishStatus)
      : "未发布",
  };
};

/**
 * 后端房型数据映射到前端
 * @deprecated 请使用 roomService.ts 中的 mapRoomFromBackend
 */
const mapRoomFromBackend = (backendRoom: any): RoomType => {
  return {
    roomId: backendRoom.room_id,
    hotelId: backendRoom.hotel_id,
    name: backendRoom.name,
    price: backendRoom.price,
    desc: backendRoom.desc,
    image: backendRoom.image || "",
    tags: backendRoom.tags || [],
    createdAt: backendRoom.createdAt,
    updatedAt: backendRoom.updatedAt,
  };
};

// ==================== 服务方法 ====================

/**
 * 是否使用 Mock 数据
 * 设置为 true 使用 Mock 数据，false 使用真实 API
 */
const USE_MOCK = false;

/**
 * 获取商户酒店列表
 * @param params 查询参数
 * @returns 酒店列表响应
 */
export const getMerchantHotels = async (
  params: HotelListParams
): Promise<HotelListResponse> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { page, pageSize } = params;
    let filteredHotels = mockHotels;

    // 按创建时间倒序排列
    filteredHotels = [...filteredHotels].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 分页
    const total = filteredHotels.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = filteredHotels.slice(startIndex, endIndex);

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  // 真实 API 模式
  try {
    const response = await request.get<{
      success: boolean;
      data: {
        list: any[];
        total: number;
        page: number;
        pageSize: number;
      };
    }>("/hotels", {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        merchant_id: params.merchantId,
      },
    });

    return {
      list: response.data.list.map(mapHotelFromBackend),
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize,
    };
  } catch (error) {
    console.error("获取酒店列表失败:", error);
    throw error;
  }
};

/**
 * 获取全量酒店列表（管理员用）
 * @param params 查询参数
 * @returns 酒店列表响应
 */
export const getAllHotels = async (
  params: Omit<HotelListParams, "merchantId">
): Promise<HotelListResponse> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { page, pageSize } = params;
    let filteredHotels = mockHotels;

    // 按创建时间倒序排列
    filteredHotels = [...filteredHotels].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 分页
    const total = filteredHotels.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = filteredHotels.slice(startIndex, endIndex);

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  // 真实 API 模式
  try {
    const response = await request.get<{
      success: boolean;
      data: {
        list: any[];
        total: number;
        page: number;
        pageSize: number;
      };
    }>("/hotels", {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    });

    return {
      list: response.data.list.map(mapHotelFromBackend),
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize,
    };
  } catch (error) {
    console.error("获取全量酒店列表失败:", error);
    throw error;
  }
};

/**
 * 获取酒店详情
 * @param id 酒店 ID
 * @returns 酒店详情
 */
export const getHotelById = async (id: string): Promise<Hotel | null> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 300));
    const hotel = mockHotels.find((h) => h.id === id);
    return hotel || null;
  }

  // 真实 API 模式
  try {
    const response = await request.get<{
      success: boolean;
      data: {
        hotel: any;
        rooms: any[];
      };
    }>(`/hotels/${id}`);

    return mapHotelFromBackend(response.data.hotel);
  } catch (error) {
    console.error("获取酒店详情失败:", error);
    throw error;
  }
};

/**
 * 获取酒店详情（含房型）
 * @param id 酒店 ID
 * @returns 酒店详情和房型列表
 * @deprecated 请使用 getHotelById 和 roomService 配合使用
 */
export const getHotelWithRooms = async (
  id: string
): Promise<{ hotel: Hotel; rooms: RoomType[] }> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 300));
    const hotel = mockHotels.find((h) => h.id === id);
    if (!hotel) {
      throw new Error("酒店不存在");
    }
    return {
      hotel,
      rooms: [], // Mock 模式暂无房型数据
    };
  }

  // 真实 API 模式
  try {
    const response = await request.get<{
      success: boolean;
      data: {
        hotel: any;
        rooms: any[];
      };
    }>(`/hotels/${id}`);

    return {
      hotel: mapHotelFromBackend(response.data.hotel),
      rooms: response.data.rooms.map(mapRoomFromBackend),
    };
  } catch (error) {
    console.error("获取酒店详情失败:", error);
    throw error;
  }
};

/**
 * 创建酒店
 * @param data 酒店数据
 * @returns 创建的酒店
 */
export const createHotel = async (
  data: Omit<Hotel, "id" | "createdAt" | "updatedAt">
): Promise<Hotel> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newHotel: Hotel = {
      ...data,
      id: `hotel-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockHotels.unshift(newHotel);
    return newHotel;
  }

  // 真实 API 模式
  try {
    console.log("[hotelService.createHotel] 前端数据:", data);
    const backendData = mapHotelToBackend(data);
    console.log("[hotelService.createHotel] 映射后的后端数据:", backendData);
    const response = await request.post<{
      success: boolean;
      data: any;
    }>("/hotels", backendData);
    console.log("[hotelService.createHotel] API 响应:", response);

    return mapHotelFromBackend(response.data);
  } catch (error) {
    console.error("[hotelService.createHotel] 创建酒店失败:", error);
    throw error;
  }
};

/**
 * 更新酒店
 * @param id 酒店 ID
 * @param data 更新数据
 * @returns 更新后的酒店
 */
export const updateHotel = async (
  id: string,
  data: Partial<Hotel>
): Promise<Hotel | null> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockHotels.findIndex((h) => h.id === id);
    if (index === -1) return null;

    mockHotels[index] = {
      ...mockHotels[index],
      ...data,
      // 酒店信息修改后，重置审核状态为"审核中"，发布状态为"未发布"
      auditStatus: "pending",
      auditReason: undefined,
      publishStatus: "draft",
      updatedAt: new Date().toISOString(),
    };

    return mockHotels[index];
  }

  // 真实 API 模式
  try {
    const backendData = mapHotelToBackend(data);
    const response = await request.put<{
      success: boolean;
      data: any;
    }>(`/hotels/${id}`, backendData);

    return mapHotelFromBackend(response.data);
  } catch (error) {
    console.error("更新酒店失败:", error);
    throw error;
  }
};

/**
 * 删除酒店
 * @param id 酒店 ID
 * @returns 是否成功
 */
export const deleteHotel = async (id: string): Promise<boolean> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockHotels.findIndex((h) => h.id === id);
    if (index === -1) return false;

    mockHotels.splice(index, 1);
    return true;
  }

  // 真实 API 模式
  try {
    await request.delete(`/hotels/${id}`);
    return true;
  } catch (error) {
    console.error("删除酒店失败:", error);
    throw error;
  }
};

/**
 * 发布酒店
 * @param hotelId 酒店 ID
 * @returns 更新后的酒店信息
 */
export const publishHotel = async (hotelId: string): Promise<Hotel> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 300));
    const hotel = mockHotels.find((h) => h.id === hotelId);
    if (!hotel) {
      throw new Error("酒店不存在");
    }
    if (hotel.auditStatus !== "approved") {
      throw new Error("只有审核通过的酒店才能发布");
    }
    if (hotel.publishStatus === "published") {
      throw new Error("酒店已发布，无需重复发布");
    }
    hotel.publishStatus = "published";
    return hotel;
  }

  // 真实 API 模式
  try {
    const response = await request.put<{
      success: boolean;
      data: any;
    }>(`/hotels/${hotelId}/publish`);

    return mapHotelFromBackend(response.data);
  } catch (error) {
    console.error("发布酒店失败:", error);
    throw error;
  }
};

/**
 * 下线酒店
 * @param hotelId 酒店 ID
 * @returns 更新后的酒店信息
 */
export const offlineHotel = async (hotelId: string): Promise<Hotel> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 300));
    const hotel = mockHotels.find((h) => h.id === hotelId);
    if (!hotel) {
      throw new Error("酒店不存在");
    }
    if (hotel.publishStatus !== "published") {
      throw new Error("只有已发布的酒店才能下线");
    }
    hotel.publishStatus = "offline";
    return hotel;
  }

  // 真实 API 模式
  try {
    const response = await request.put<{
      success: boolean;
      data: any;
    }>(`/hotels/${hotelId}/offline`);

    return mapHotelFromBackend(response.data);
  } catch (error) {
    console.error("下线酒店失败:", error);
    throw error;
  }
};

/**
 * 上线酒店
 * @param hotelId 酒店 ID
 * @returns 更新后的酒店信息
 */
export const onlineHotel = async (hotelId: string): Promise<Hotel> => {
  if (USE_MOCK) {
    // Mock 模式
    await new Promise((resolve) => setTimeout(resolve, 300));
    const hotel = mockHotels.find((h) => h.id === hotelId);
    if (!hotel) {
      throw new Error("酒店不存在");
    }
    if (hotel.publishStatus !== "offline") {
      throw new Error("只有已下线的酒店才能上线");
    }
    hotel.publishStatus = "published";
    return hotel;
  }

  // 真实 API 模式
  try {
    const response = await request.put<{
      success: boolean;
      data: any;
    }>(`/hotels/${hotelId}/online`);

    return mapHotelFromBackend(response.data);
  } catch (error) {
    console.error("上线酒店失败:", error);
    throw error;
  }
};

// ==================== 图片上传 ====================

/**
 * 上传单张酒店图片
 * @param file 图片文件
 * @returns 上传后的图片 URL
 */
export const uploadHotelImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await request.post<{
      success: boolean;
      message: string;
      data: {
        url: string;
        filename: string;
        originalName: string;
        size: number;
      };
    }>("/hotels/upload", formData, {
      headers: {},
    });

    // 返回完整的图片 URL
    return `http://localhost:4000${response.data.url}`;
  } catch (error) {
    console.error("上传图片失败:", error);
    throw error;
  }
};

/**
 * 上传多张酒店图片
 * @param files 图片文件数组
 * @returns 上传后的图片 URL 数组
 */
export const uploadHotelImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await request.post<{
      success: boolean;
      message: string;
      data: {
        urls: string[];
        count: number;
      };
    }>("/hotels/upload/multiple", formData);

    // 返回完整的图片 URL 数组
    return response.data.urls.map((url) => `http://localhost:4000${url}`);
  } catch (error) {
    console.error("上传图片失败:", error);
    throw error;
  }
};

// 导出 Mock 数据供测试使用
export { mockHotels };

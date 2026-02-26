/**
 * 审核服务层
 * 提供酒店审核相关的 API 调用
 */

import type { Hotel } from "../types";
import { request } from "./api";

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
 * 后端酒店数据映射到前端
 */
const mapHotelFromBackend = (backendHotel: any): Hotel => {
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
    images: backendHotel.image_url
      ? backendHotel.image_url.split(",").filter(Boolean)
      : [],
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

// ==================== 服务方法 ====================

/**
 * 审核通过酒店
 * @param hotelId 酒店 ID
 * @returns 更新后的酒店信息
 */
export const approveHotel = async (hotelId: string): Promise<Hotel> => {
  try {
    const response = await request.put<{
      success: boolean;
      data: any;
    }>(`/hotels/${hotelId}/approve`);

    return mapHotelFromBackend(response.data);
  } catch (error) {
    console.error("审核通过酒店失败:", error);
    throw error;
  }
};

/**
 * 审核不通过酒店
 * @param hotelId 酒店 ID
 * @param reason 不通过原因
 * @returns 更新后的酒店信息
 */
export const rejectHotel = async (
  hotelId: string,
  reason: string
): Promise<Hotel> => {
  try {
    const response = await request.put<{
      success: boolean;
      data: any;
    }>(`/hotels/${hotelId}/reject`, { reason });

    return mapHotelFromBackend(response.data);
  } catch (error) {
    console.error("审核不通过酒店失败:", error);
    throw error;
  }
};

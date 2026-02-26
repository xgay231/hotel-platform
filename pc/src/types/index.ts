/**
 * 全局类型定义
 * 统一管理项目中使用的所有 TypeScript 类型
 */

// ==================== 用户与认证相关 ====================

/** 用户角色 */
export const UserRole = {
  MERCHANT: "merchant", // 商户
  ADMIN: "admin", // 管理员
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/** 用户信息 */
export interface UserInfo {
  userid: string;
  username: string;
  role: UserRole;
  email?: string;
  phone?: string;
  createdAt?: string;
}

/** 登录请求参数 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 登录响应 */
export interface LoginResponse {
  token: string;
  user: UserInfo;
}

/** 注册请求参数 */
export interface RegisterRequest {
  username: string;
  password: string;
  role: UserRole;
  email?: string;
  phone?: string;
}

/** 注册响应 */
export interface RegisterResponse {
  token: string;
  user: UserInfo;
}

// ==================== 酒店相关 ====================

/** 审核状态 */
export const AuditStatus = {
  PENDING: "pending", // 审核中
  APPROVED: "approved", // 通过
  REJECTED: "rejected", // 不通过
} as const;

export type AuditStatus = (typeof AuditStatus)[keyof typeof AuditStatus];

/** 发布状态 */
export const PublishStatus = {
  DRAFT: "draft", // 未发布
  PUBLISHED: "published", // 已发布
  OFFLINE: "offline", // 已下线
} as const;

export type PublishStatus = (typeof PublishStatus)[keyof typeof PublishStatus];

/** 酒店星级 */
export const HotelStar = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
} as const;

export type HotelStar = (typeof HotelStar)[keyof typeof HotelStar];

/** 酒店设施标签 */
export interface HotelFacility {
  id: string;
  name: string;
  icon?: string;
}

/** 酒店信息 */
export interface Hotel {
  // === 标识字段 ===
  id: string; // hotel_id
  merchantId: string; // merchant_id
  merchantName?: string; // merchant_name

  // === 基本信息（可编辑） ===
  name: string; // name_cn - 中文名称
  nameEn?: string; // name_en - 英文名称
  star: HotelStar; // star - 星级
  province: string; // province - 省份
  city: string; // city - 城市
  address: string; // address - 详细地址

  // === 价格与时间（可编辑） ===
  minPrice: number; // min_price - 最低价格
  openTime?: string; // open_time - 开业时间

  // === 图片相关（可编辑） ===
  coverImage?: string; // cover_image - 封面图片
  images: string[]; // image_url - 图片URL列表

  // === 描述与标签（可编辑） ===
  description: string; // desc - 酒店描述
  tags: string[]; // tags - 标签

  // === 设施（可编辑） ===
  facilities: HotelFacility[]; // facilities - 酒店设施

  // === 审核与发布状态（只读） ===
  auditStatus: AuditStatus; // audit_status - 审核状态
  auditReason?: string; // audit_reason - 审核原因（不通过时）
  publishStatus: PublishStatus; // publish_status - 发布状态

  // === 统计数据（只读，系统自动计算） ===
  rating: number; // rating - 评分(0-5)
  reviewCount: number; // review_count - 评论数
  favoriteCount: number; // favorite_count - 收藏数

  // === 时间戳（只读） ===
  createdAt: string; // createdAt
  updatedAt: string; // updatedAt
}

/** 酒店可编辑字段（用于创建/更新请求） */
export interface HotelEditableFields {
  // 基本信息
  name: string; // name_cn - 中文名称
  nameEn?: string; // name_en - 英文名称
  star: HotelStar; // star - 星级
  province: string; // province - 省份
  city: string; // city - 城市
  address: string; // address - 详细地址

  // 价格与时间
  minPrice: number; // min_price - 最低价格
  openTime?: string; // open_time - 开业时间

  // 图片相关
  coverImage?: string; // cover_image - 封面图片
  images?: string[]; // image_url - 图片URL列表

  // 描述与标签
  description?: string; // desc - 酒店描述
  tags?: string[]; // tags - 标签

  // 设施
  facilities?: HotelFacility[]; // facilities - 酒店设施
}

/** 酒店列表查询参数 */
export interface HotelListParams {
  page: number;
  pageSize: number;
  auditStatus?: AuditStatus;
  publishStatus?: PublishStatus;
  merchantId?: string;
}

/** 酒店列表响应 */
export interface HotelListResponse {
  list: Hotel[];
  total: number;
  page: number;
  pageSize: number;
}

/** 酒店创建/更新请求 */
export interface HotelRequest {
  // 基本信息
  name: string; // name_cn - 中文名称
  nameEn?: string; // name_en - 英文名称
  star: HotelStar; // star - 星级
  province: string; // province - 省份
  city: string; // city - 城市
  address: string; // address - 详细地址

  // 价格与时间
  minPrice: number; // min_price - 最低价格
  openTime?: string; // open_time - 开业时间

  // 图片相关
  coverImage?: string; // cover_image - 封面图片
  images?: string[]; // image_url - 图片URL列表

  // 描述与标签
  description?: string; // desc - 酒店描述
  tags?: string[]; // tags - 标签

  // 设施
  facilities?: HotelFacility[]; // facilities - 酒店设施

  // 房型（创建时可选）
  roomTypes?: CreateRoomRequest[];
}

// ==================== 房型相关 ====================

/** 房型信息 - 与后端 HotelRoom 模型对齐 */
export interface RoomType {
  roomId: string; // room_id
  hotelId: string; // hotel_id
  name: string; // 房型名称
  price: number; // 价格
  desc: string; // 描述
  image?: string; // 房型图片
  tags: string[]; // 标签
  createdAt?: string;
  updatedAt?: string;
}

/** 房型创建请求 */
export interface CreateRoomRequest {
  name: string;
  price: number;
  desc: string;
  image?: string;
  tags?: string[];
}

/** 房型更新请求 */
export interface UpdateRoomRequest {
  name?: string;
  price?: number;
  desc?: string;
  image?: string;
  tags?: string[];
}

/** 房型列表响应 */
export interface RoomTypeListResponse {
  list: RoomType[];
  total: number;
}

// ==================== 审核相关 ====================

/** 审核操作类型 */
export const AuditAction = {
  APPROVE: "approve", // 通过
  REJECT: "reject", // 不通过
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

/** 审核请求参数 */
export interface AuditRequest {
  hotelId: string;
  action: AuditAction;
  reason?: string; // 不通过原因
}

/** 发布操作类型 */
export const PublishAction = {
  PUBLISH: "publish", // 发布
  OFFLINE: "offline", // 下线
  ONLINE: "online", // 上线
} as const;

export type PublishAction = (typeof PublishAction)[keyof typeof PublishAction];

/** 发布请求参数 */
export interface PublishRequest {
  hotelId: string;
  action: PublishAction;
}

// ==================== 分页相关 ====================

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== API 响应通用类型 ====================

/** API 成功响应 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/** API 错误响应 */
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

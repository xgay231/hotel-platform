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
  id: string;
  name: string;
  star: HotelStar;
  address: string;
  city: string;
  province: string;
  description: string;
  images: string[];
  facilities: HotelFacility[];
  auditStatus: AuditStatus;
  publishStatus: PublishStatus;
  rejectReason?: string;
  merchantId: string;
  merchantName?: string;
  createdAt: string;
  updatedAt: string;
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
  id?: string;
  name: string;
  star: HotelStar;
  address: string;
  city: string;
  province: string;
  description: string;
  images: string[];
  facilities: HotelFacility[];
  roomTypes?: RoomTypeRequest[];
}

// ==================== 房型相关 ====================

/** 房型信息 */
export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  area: number; // 面积（平方米）
  bedType: string; // 床型
  maxOccupancy: number; // 最大入住人数
  price: number; // 价格
  amenities: string[]; // 设施
  images: string[];
  createdAt: string;
  updatedAt: string;
}

/** 房型创建/更新请求 */
export interface RoomTypeRequest {
  id?: string;
  name: string;
  area: number;
  bedType: string;
  maxOccupancy: number;
  price: number;
  amenities: string[];
  images: string[];
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

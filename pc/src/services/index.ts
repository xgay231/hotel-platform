/**
 * 服务层统一导出
 * 提供所有服务模块的统一入口
 */

// 认证服务
export * from "./authService";

// 酒店服务
export * from "./hotelService";

// 房型服务
export * from "./roomService";

// 审核服务
export * from "./auditService";

// API 客户端
export { default as api } from "./api";
export { request } from "./api";

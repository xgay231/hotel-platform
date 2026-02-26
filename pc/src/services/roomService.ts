/**
 * 房型服务层
 * 提供房型相关的 API 调用
 */

import type { RoomType, CreateRoomRequest, UpdateRoomRequest } from "../types";
import { request } from "./api";

// ==================== 字段映射 ====================

/**
 * 后端房型数据映射到前端
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

/**
 * 前端房型数据映射到后端
 */
const mapRoomToBackend = (frontendRoom: CreateRoomRequest): any => {
  return {
    name: frontendRoom.name,
    price: frontendRoom.price,
    desc: frontendRoom.desc,
    image: frontendRoom.image || "",
    tags: frontendRoom.tags || [],
  };
};

// ==================== 服务方法 ====================

/**
 * 创建房型
 * @param hotelId 酒店 ID
 * @param data 房型数据
 * @returns 创建的房型
 */
export const createRoom = async (
  hotelId: string,
  data: CreateRoomRequest
): Promise<RoomType> => {
  try {
    console.log("[roomService.createRoom] 前端数据:", data);
    const backendData = mapRoomToBackend(data);
    console.log("[roomService.createRoom] 映射后的后端数据:", backendData);
    const response = await request.post<{
      success: boolean;
      data: any;
    }>(`/hotels/${hotelId}/rooms`, backendData);
    console.log("[roomService.createRoom] API 响应:", response);

    return mapRoomFromBackend(response.data);
  } catch (error) {
    console.error("创建房型失败:", error);
    throw error;
  }
};

/**
 * 更新房型
 * @param hotelId 酒店 ID
 * @param roomId 房型 ID
 * @param data 更新数据
 * @returns 更新后的房型
 */
export const updateRoom = async (
  hotelId: string,
  roomId: string,
  data: UpdateRoomRequest
): Promise<RoomType> => {
  try {
    const response = await request.put<{
      success: boolean;
      data: any;
    }>(`/hotels/${hotelId}/rooms/${roomId}`, data);

    return mapRoomFromBackend(response.data);
  } catch (error) {
    console.error("更新房型失败:", error);
    throw error;
  }
};

/**
 * 删除房型
 * @param hotelId 酒店 ID
 * @param roomId 房型 ID
 */
export const deleteRoom = async (
  hotelId: string,
  roomId: string
): Promise<void> => {
  try {
    await request.delete(`/hotels/${hotelId}/rooms/${roomId}`);
  } catch (error) {
    console.error("删除房型失败:", error);
    throw error;
  }
};

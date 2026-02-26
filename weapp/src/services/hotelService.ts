import { request } from "./http";
import type {
  HotelDetail,
  HotelListQuery,
  HotelListResponse,
} from "../types/hotel";

export const getHotelList = (params: HotelListQuery) => {
  return request<HotelListResponse>("/weapp/hotels", {
    method: "GET",
    params: params as Record<string, unknown>,
  });
};

export const getHotelDetail = (hotelId: string) => {
  return request<HotelDetail>(`/weapp/hotels/${hotelId}`, {
    method: "GET",
  });
};

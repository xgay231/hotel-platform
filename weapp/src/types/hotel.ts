import type { PageResponse } from "./api";

export interface BannerItem {
  id: string;
  image_url: string;
  hotel_id: string;
}

export interface HotelListQuery {
  province?: string;
  city?: string;
  keyword?: string;
  checkInDate?: string;
  checkOutDate?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  starLevel?: number | string;
  tags?: string;
  sortBy?: "priceAsc" | "priceDesc" | "ratingDesc";
  page?: number;
  pageSize?: number;
}

export interface HotelListItem {
  hotel_id: string;
  name_cn: string;
  star: number;
  address: string;
  min_price: number;
  cover_image: string;
  tags: string[];
  rating: number;
}

export type HotelListResponse = PageResponse<HotelListItem>;

export interface RoomType {
  room_id: string;
  name: string;
  price: number;
  desc: string;
  tags: string[];
}

export interface HotelBaseInfo {
  hotel_id: string;
  name_cn: string;
  name_en: string;
  star: number;
  address: string;
  open_time: string;
  cover_image: string;
  images?: string[];
  desc: string;
  facilities?: string[];
  tags: string[];
  rating?: number;
  review_count?: number;
}

export interface HotelDetail {
  hotel: HotelBaseInfo;
  rooms: RoomType[];
}

import { request } from "./http";
import type { BannerItem } from "../types/hotel";

export const getBanners = () => {
  return request<BannerItem[]>("/weapp/banners", {
    method: "GET",
  });
};

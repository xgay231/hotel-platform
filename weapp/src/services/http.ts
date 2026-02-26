import Taro from "@tarojs/taro";
import { API_CONFIG } from "./config";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

type ApiErrorResponse = {
  success: false;
  message?: string;
  errorCode?: string;
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
  showErrorToast?: boolean;
  timeout?: number;
  header?: Record<string, string>;
};

const appendQuery = (
  url: string,
  params?: RequestOptions["params"]
): string => {
  if (!params) return url;

  const query = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  if (!query) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${query}`;
};

const showError = (message: string) => {
  Taro.showToast({
    title: message,
    icon: "none",
    duration: 2000,
  });
};

export const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    data,
    params,
    showErrorToast = true,
    timeout = API_CONFIG.timeout,
    header,
  } = options;

  const url = appendQuery(`${API_CONFIG.baseURL}${path}`, params);

  if (path.includes("/weapp/hotels")) {
    console.info("[weapp-http] request:", { path, method, url, params, data });
  }

  try {
    const response = await Taro.request<ApiResponse<T>>({
      url,
      method,
      data,
      timeout,
      header,
    });

    const responseData = response.data;

    if (!responseData) {
      throw new Error("响应为空");
    }

    if (!responseData.success) {
      const message = responseData.message || "请求失败";
      if (showErrorToast) showError(message);
      throw new Error(message);
    }

    if (path.includes("/weapp/hotels")) {
      console.info("[weapp-http] response success:", {
        path,
        statusCode: response.statusCode,
        data: responseData.data,
      });
    }

    return responseData.data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "网络异常，请稍后重试";

    if (path.includes("/weapp/hotels")) {
      console.error("[weapp-http] request failed:", {
        path,
        method,
        url,
        params,
        data,
        message,
      });
    }

    if (showErrorToast) showError(message);
    throw error;
  }
};

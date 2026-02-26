/**
 * Axios 客户端配置
 * 统一管理 HTTP 请求、拦截器和错误处理
 */

import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { notifyError } from "./notify";

// API 基础配置
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const API_TIMEOUT = 10000;

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  // 不全局设置 Content-Type，避免影响 FormData 上传
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一处理响应数据
    return response;
  },
  (error: AxiosError) => {
    const { response, request, message: errorMessage } = error;

    // 处理响应错误
    if (response) {
      const status = response.status;
      const data = response.data as any;

      switch (status) {
        case 401:
          // token 过期或无效，清除本地存储并跳转到登录页
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          notifyError("登录已过期，请重新登录");
          window.location.href = "/login";
          break;
        case 403:
          notifyError("没有权限访问该资源");
          break;
        case 404:
          notifyError("请求的资源不存在");
          break;
        case 500:
          notifyError(data?.message || "服务器错误，请稍后重试");
          break;
        default:
          notifyError(data?.message || `请求失败 (${status})`);
      }
    } else if (request) {
      // 请求已发出但没有收到响应
      notifyError("网络错误，请检查网络连接");
    } else {
      // 请求配置出错
      notifyError(errorMessage || "请求配置错误");
    }

    return Promise.reject(error);
  }
);

// 导出 API 实例
export default api;

// 导出请求方法封装
export const request = {
  get: <T = any>(url: string, config?: any) =>
    api.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: any) =>
    api.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: any) =>
    api.put<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: any) =>
    api.delete<T>(url, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    api.patch<T>(url, data, config).then((res) => res.data),
};

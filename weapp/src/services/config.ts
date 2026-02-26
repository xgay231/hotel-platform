import Taro from "@tarojs/taro";

const DEFAULT_BASE_URL_MAP: Record<string, string> = {
  development: "http://localhost:4000/api",
  production: "https://api.example.com/api",
  test: "/api",
};

const getNodeEnv = (): string => {
  const env = (globalThis as { process?: { env?: Record<string, string> } })
    .process?.env?.NODE_ENV;
  return env || "development";
};

export const getBaseURL = (): string => {
  const env = getNodeEnv();
  const envBaseUrl = (
    globalThis as { process?: { env?: Record<string, string> } }
  ).process?.env?.TARO_APP_API_BASE_URL;

  if (envBaseUrl) {
    return envBaseUrl;
  }

  // H5 环境下使用代理，避免 CORS 问题
  if (Taro.getEnv() === "WEB") {
    return "/api";
  }

  return DEFAULT_BASE_URL_MAP[env] || DEFAULT_BASE_URL_MAP.development;
};

export const API_CONFIG = {
  baseURL: getBaseURL(),
  timeout: 10000,
};

export const normalizeAssetUrl = (rawUrl: unknown): string => {
  if (typeof rawUrl !== "string") return "";
  let url = rawUrl.trim();
  if (!url) return "";

  // 新增：如果已经是 localhost:4000 的完整路径，强制去除非法域名，转为相对路径
  if (url.includes("localhost:4000/uploads/")) {
    url = url.replace(/https?:\/\/localhost:4000/, "");
  }

  // 相对上传路径统一补全为服务端完整地址
  if (url.startsWith("/uploads/")) {
    // H5 环境下直接返回相对路径，走代理，避免 CORS
    if (Taro.getEnv() === "WEB") {
      return url;
    }
    const origin = API_CONFIG.baseURL.replace(/\/api\/?$/, "");
    return `${origin}${url}`;
  }

  // 兼容历史数据中的 127.0.0.1，统一归一为 localhost
  // 避免微信基础库对 127.0.0.1 资源加载限制导致图片无法展示
  if (/^https?:\/\/127\.0\.0\.1(?::\d+)?\//i.test(url)) {
    return url.replace("127.0.0.1", "localhost");
  }

  // 完整 URL 直接返回；其余原样返回
  return url;
};

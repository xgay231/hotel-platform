/**
 * 用户状态管理
 * 使用 Zustand + persist 实现状态持久化
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo, UserRole } from "@/types";

interface UserState {
  // 状态字段
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;

  // 计算属性方法
  getRole: () => UserRole | null;
  getUserId: () => string | null;
  getUsername: () => string | null;
  isAdmin: () => boolean;
  isMerchant: () => boolean;

  // 操作方法
  setAuth: (token: string, user: UserInfo) => void;
  logout: () => void;
  updateUser: (user: Partial<UserInfo>) => void;
  clearAuth: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      token: null,
      user: null,
      isAuthenticated: false,

      // 计算属性方法
      getRole: () => get().user?.role || null,
      getUserId: () => get().user?.userid || null,
      getUsername: () => get().user?.username || null,
      isAdmin: () => get().user?.role === "admin",
      isMerchant: () => get().user?.role === "merchant",

      // 设置认证信息
      setAuth: (token, user) => {
        // 同步存储到 localStorage 以便 axios 拦截器使用
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
      },

      // 登出
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isAuthenticated: false });
      },

      // 更新用户信息
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // 清除认证信息（用于401等场景）
      clearAuth: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "user-storage", // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;

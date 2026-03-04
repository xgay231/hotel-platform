/**
 * 路由配置
 * 公开路由：/login, /register
 * 受保护路由：/merchant/*, /admin/*
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import HotelList from "@/pages/merchant/HotelList";
import AuditList from "@/pages/admin/AuditList";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

const router = createBrowserRouter([
  // 根路径重定向到登录页
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // ==================== 公开路由区域 ====================
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // ==================== 商户路由区域（受保护）====================
  {
    path: "/merchant",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="hotel/list" replace />,
      },
      {
        path: "hotel/list",
        element: <HotelList />,
      },
    ],
  },

  // ==================== 管理员路由区域（受保护）====================
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="hotel/list" replace />,
      },
      {
        path: "hotel/list",
        element: <HotelList />,
      },
      {
        path: "audit",
        element: <AuditList />,
      },
    ],
  },

  // ==================== 404 页面 ====================
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

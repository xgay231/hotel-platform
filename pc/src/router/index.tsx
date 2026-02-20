import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import HotelEdit from "@/pages/merchant/HotelEdit";
import AuditList from "@/pages/admin/AuditList";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ padding: 20 }}>
      {/* 这里的 Header 只是示意，后面会换成 Ant Design 的 Layout */}
      <header style={{ marginBottom: 20, borderBottom: "1px solid #ddd" }}>
        <h3>酒店管理系统导航栏</h3>
      </header>
      <main>{children}</main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />, // 默认跳转到登录
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // 商户路由区域 - 需要登录
  {
    path: "/merchant",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <HotelEdit />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "hotel/edit", // 完整路径 /merchant/hotel/edit
        element: (
          <ProtectedRoute>
            <HotelEdit />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // 管理员路由区域 - 需要登录
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AuditList />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "audit", // 完整路径 /admin/audit
        element: (
          <ProtectedRoute>
            <AuditList />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

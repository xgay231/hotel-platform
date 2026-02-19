import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import HotelEdit from "@/pages/merchant/HotelEdit";
import AuditList from "@/pages/admin/AuditList";
import NotFound from "@/pages/NotFound";

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
  // 商户路由区域
  {
    path: "/merchant",
    element: (
      <DashboardLayout>
        <HotelEdit />
      </DashboardLayout>
    ), // 暂时直接展示编辑页
    children: [
      {
        path: "hotel/edit", // 完整路径 /merchant/hotel/edit
        element: <HotelEdit />,
      },
    ],
  },
  // 管理员路由区域
  {
    path: "/admin",
    element: (
      <DashboardLayout>
        <AuditList />
      </DashboardLayout>
    ),
    children: [
      {
        path: "audit", // 完整路径 /admin/audit
        element: <AuditList />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

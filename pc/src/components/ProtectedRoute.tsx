/**
 * 路由保护组件
 * 未登录时重定向到登录页
 */

import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "@/store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "merchant" | "admin"; // 可选的角色要求
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isAdmin = useUserStore((state) => state.isAdmin());
  const isMerchant = useUserStore((state) => state.isMerchant());
  const location = useLocation();

  // 未登录时重定向到登录页，并保存当前路径
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 检查角色权限
  if (requiredRole) {
    if (requiredRole === "admin" && !isAdmin) {
      // 需要管理员权限但当前用户不是管理员
      return <Navigate to="/merchant" replace />;
    }
    if (requiredRole === "merchant" && !isMerchant) {
      // 需要商户权限但当前用户不是商户
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

/**
 * 后台管理布局组件
 * 左侧导航 + 右侧内容区
 */

import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* 左侧导航栏 - 占位 */}
      <aside style={{ width: 240, background: "#001529", color: "#fff" }}>
        <div style={{ padding: 16, fontSize: 18, fontWeight: "bold" }}>
          酒店管理系统
        </div>
        {/* 导航菜单将在步骤08实现 */}
      </aside>

      {/* 右侧内容区 */}
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
};

export default DashboardLayout;

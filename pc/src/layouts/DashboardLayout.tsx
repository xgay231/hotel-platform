/**
 * 后台管理布局组件
 * 左侧导航 + 右侧内容区
 * 支持根据角色动态显示菜单
 */

import React, { useMemo } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  ShopOutlined,
  EditOutlined,
  AuditOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useUserStore from "@/store/userStore";
import type { MenuProps } from "antd";

const { Sider, Content } = Layout;

/**
 * 商户菜单项配置
 */
const merchantMenuItems: MenuProps["items"] = [
  {
    key: "/merchant/hotel/list",
    icon: <ShopOutlined />,
    label: "酒店列表",
  },
  {
    key: "/merchant/hotel/edit",
    icon: <EditOutlined />,
    label: "新建酒店",
  },
];

/**
 * 管理员菜单项配置
 */
const adminMenuItems: MenuProps["items"] = [
  {
    key: "/admin/audit",
    icon: <AuditOutlined />,
    label: "审核列表",
  },
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isMerchant, isAdmin } = useUserStore();

  // 根据角色获取菜单项
  const menuItems = useMemo(() => {
    if (isMerchant()) return merchantMenuItems;
    if (isAdmin()) return adminMenuItems;
    return [];
  }, [isMerchant, isAdmin]);

  // 获取当前选中的菜单项
  const selectedKeys = useMemo(() => {
    return [location.pathname];
  }, [location.pathname]);

  // 菜单点击处理
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  // 退出登录处理
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 左侧导航栏 */}
      <Sider
        width={240}
        style={{
          background: "#001529",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* 系统标题 */}
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <ShopOutlined style={{ marginRight: 8 }} />
            酒店管理系统
          </div>

          {/* 导航菜单 */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <Menu
              theme="dark"
              mode="inline"
              items={menuItems}
              selectedKeys={selectedKeys}
              onClick={handleMenuClick}
              style={{ borderRight: 0 }}
            />
          </div>

          {/* 底部用户区域 */}
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="topLeft"
              trigger={["click"]}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{ marginRight: 8, backgroundColor: "#1890ff" }}
                />
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.username || "用户"}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.65)",
                    marginLeft: 8,
                  }}
                >
                  {isMerchant() ? "商户" : isAdmin() ? "管理员" : ""}
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </Sider>

      {/* 右侧内容区 */}
      <Layout>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

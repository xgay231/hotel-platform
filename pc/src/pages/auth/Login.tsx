import { useState } from "react";
import { App, Form, Input, Button, Card, Typography, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/authService";
import useUserStore from "@/store/userStore";

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);

  const { message } = App.useApp();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await login(values);
      message.success(response.message || "登录成功");
      setAuth(response.token, response.user);
      // 根据用户角色跳转到不同页面
      const role = response.user.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/merchant");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "登录失败，请稍后重试";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          borderRadius: 8,
        }}
      >
        <Space vertical size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={3} style={{ marginBottom: 8 }}>
              酒店管理系统
            </Title>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "请输入用户名" },
                { min: 3, message: "用户名至少3个字符" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码" },
                { min: 6, message: "密码至少6个字符" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              还没有账户？{" "}
              <Link to="/register" style={{ color: "#1890ff" }}>
                立即注册
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;

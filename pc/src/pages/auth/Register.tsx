import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Space,
  Radio,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/services/authService";
import { UserRole } from "@/types";

const { Title, Text } = Typography;

interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await register({
        username: values.username,
        password: values.password,
        role: values.role,
      });
      message.success(response.message || "注册成功，请登录");
      // 注册成功后跳转到登录页
      navigate("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "注册失败，请稍后重试";
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
              创建账户
            </Title>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="role"
              initialValue={UserRole.MERCHANT}
              rules={[{ required: true, message: "请选择角色" }]}
              style={{ marginBottom: 16 }}
            >
              <Space size="large">
                <Text>角色</Text>
                <Radio.Group defaultValue={UserRole.MERCHANT}>
                  <Radio value={UserRole.MERCHANT}>商户</Radio>
                  <Radio value={UserRole.ADMIN}>管理员</Radio>
                </Radio.Group>
              </Space>
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: "请输入用户名" },
                { min: 3, message: "用户名至少3个字符" },
                { max: 20, message: "用户名最多20个字符" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名只能包含字母、数字和下划线",
                },
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
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "请确认密码" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                注册
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              已有账户？{" "}
              <Link to="/login" style={{ color: "#1890ff" }}>
                立即登录
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Register;

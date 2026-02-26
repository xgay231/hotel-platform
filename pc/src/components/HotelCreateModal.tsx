/**
 * 酒店新建弹窗组件
 * 支持酒店基础信息录入与保存
 */

import React, { useState } from "react";
import { Modal, Form, Input, Select, message, Space } from "antd";
import type { Hotel, HotelStar } from "../types";
import { createHotel } from "../services/hotelService";
import useUserStore from "../store/userStore";

const { TextArea } = Input;

// ==================== 省市数据 ====================

/** 省市映射表 */
const PROVINCE_CITY_MAP: Record<string, string[]> = {
  北京市: ["北京市"],
  上海市: ["上海市"],
  广东省: ["广州市", "深圳市", "珠海市", "东莞市"],
  浙江省: ["杭州市", "宁波市", "温州市", "绍兴市"],
  江苏省: ["南京市", "苏州市", "无锡市", "常州市"],
  四川省: ["成都市", "绵阳市", "乐山市", "峨眉山市"],
  云南省: ["昆明市", "大理市", "丽江市", "西双版纳"],
  海南省: ["海口市", "三亚市", "琼海市"],
};

/** 省份列表 */
const PROVINCES = Object.keys(PROVINCE_CITY_MAP);

/** 星级选项 */
const STAR_OPTIONS: { label: string; value: HotelStar }[] = [
  { label: "一星", value: 1 },
  { label: "二星", value: 2 },
  { label: "三星", value: 3 },
  { label: "四星", value: 4 },
  { label: "五星", value: 5 },
];

// ==================== 组件 Props ====================

export interface HotelCreateModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

// ==================== 组件定义 ====================

/**
 * 酒店新建弹窗组件
 */
const HotelCreateModal: React.FC<HotelCreateModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  // 获取当前用户信息
  const { user } = useUserStore();

  /**
   * 省份变化处理
   */
  const handleProvinceChange = (province: string) => {
    // 清空城市选择
    form.setFieldValue("city", undefined);
    // 更新城市列表
    setCities(PROVINCE_CITY_MAP[province] || []);
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    try {
      // 表单校验
      const values = await form.validateFields();
      console.log("[HotelCreateModal] 表单值:", values);

      setLoading(true);

      // 构建酒店数据
      const hotelData: Omit<Hotel, "id" | "createdAt" | "updatedAt"> = {
        name: values.name,
        star: values.star,
        province: values.province,
        city: values.city,
        address: values.address,
        description: values.description || "",
        images: [], // 暂时为空，后续步骤完善
        facilities: [], // 暂时为空，后续步骤完善
        auditStatus: "pending", // 默认审核中
        publishStatus: "draft", // 默认未发布
        merchantId: user?.userid || "",
        merchantName: user?.username || "",
      };
      console.log("[HotelCreateModal] 构建的酒店数据:", hotelData);

      // 调用创建 API
      await createHotel(hotelData);

      message.success("酒店创建成功");

      // 重置表单
      form.resetFields();
      setCities([]);

      // 触发成功回调
      onSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单校验失败
        message.warning("请检查表单填写是否正确");
      } else {
        // API 调用失败
        message.error(error.message || "创建失败，请稍后重试");
        console.error("创建酒店失败:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 取消处理
   */
  const handleCancel = () => {
    form.resetFields();
    setCities([]);
    onCancel();
  };

  return (
    <Modal
      title="新建酒店"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
      okText="提交"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={{
          star: 3,
        }}
      >
        <Form.Item
          label="酒店名称"
          name="name"
          rules={[
            { required: true, message: "请输入酒店名称" },
            { min: 2, max: 50, message: "酒店名称长度为 2-50 个字符" },
          ]}
        >
          <Input placeholder="请输入酒店名称" maxLength={50} showCount />
        </Form.Item>

        <Form.Item
          label="酒店星级"
          name="star"
          rules={[{ required: true, message: "请选择酒店星级" }]}
        >
          <Select
            placeholder="请选择酒店星级"
            options={STAR_OPTIONS}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Space.Compact style={{ width: "100%" }}>
          <Form.Item
            label="省份"
            name="province"
            rules={[{ required: true, message: "请选择省份" }]}
            style={{ width: "50%", marginBottom: 0 }}
          >
            <Select
              placeholder="请选择省份"
              onChange={handleProvinceChange}
              options={PROVINCES.map((p) => ({ label: p, value: p }))}
            />
          </Form.Item>

          <Form.Item
            label="城市"
            name="city"
            rules={[{ required: true, message: "请选择城市" }]}
            style={{ width: "50%", marginBottom: 0 }}
          >
            <Select
              placeholder="请先选择省份"
              disabled={cities.length === 0}
              options={cities.map((c) => ({ label: c, value: c }))}
            />
          </Form.Item>
        </Space.Compact>

        <Form.Item
          label="详细地址"
          name="address"
          rules={[
            { required: true, message: "请输入详细地址" },
            { max: 200, message: "地址最多 200 个字符" },
          ]}
        >
          <Input placeholder="请输入详细地址" maxLength={200} showCount />
        </Form.Item>

        <Form.Item
          label="酒店描述"
          name="description"
          rules={[{ max: 500, message: "描述最多 500 个字符" }]}
        >
          <TextArea
            placeholder="请输入酒店描述（选填）"
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HotelCreateModal;

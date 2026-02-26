/**
 * 酒店新建弹窗组件
 * 支持酒店基础信息录入与保存
 */

import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Upload,
  Divider,
} from "antd";
import type { Hotel, HotelStar } from "../types";
import { createHotel, uploadHotelImage } from "../services/hotelService";
import useUserStore from "../store/userStore";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

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

  // 图片上传相关状态
  const [coverImageFileList, setCoverImageFileList] = useState<UploadFile[]>(
    []
  );
  const [imagesFileList, setImagesFileList] = useState<UploadFile[]>([]);

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
        // 标识字段
        merchantId: user?.userid || "",
        merchantName: user?.username || "",
        // 基本信息
        name: values.name,
        nameEn: values.nameEn || "",
        star: values.star,
        province: values.province,
        city: values.city,
        address: values.address,
        // 价格与时间
        minPrice: values.minPrice || 0,
        openTime: values.openTime || "",
        // 图片相关
        coverImage: values.coverImage || "",
        images: values.images || [],
        // 描述与标签
        description: values.description || "",
        tags: values.tags || [],
        // 设施
        facilities: [], // 暂时为空，后续步骤完善
        // 审核与发布状态
        auditStatus: "pending", // 默认审核中
        publishStatus: "draft", // 默认未发布
        auditReason: "",
        // 统计数据（默认值）
        rating: 0,
        reviewCount: 0,
        favoriteCount: 0,
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
    setCoverImageFileList([]);
    setImagesFileList([]);
    onCancel();
  };

  /**
   * 封面图片上传处理
   */
  const handleCoverImageUpload: UploadProps["customRequest"] = async (
    options
  ) => {
    const { file, onSuccess, onError } = options;
    try {
      const url = await uploadHotelImage(file as File);
      onSuccess?.(url);
      form.setFieldValue("coverImage", url);
      message.success("封面图片上传成功");
    } catch (error) {
      onError?.(error as Error);
      message.error("封面图片上传失败");
    }
  };

  /**
   * 多图上传处理
   */
  const handleImagesUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const url = await uploadHotelImage(file as File);
      onSuccess?.(url);
      // 更新表单值
      const currentImages = form.getFieldValue("images") || [];
      form.setFieldValue("images", [...currentImages, url]);
      message.success("图片上传成功");
    } catch (error) {
      onError?.(error as Error);
      message.error("图片上传失败");
    }
  };

  /**
   * 封面图片移除处理
   */
  const handleCoverImageRemove = () => {
    form.setFieldValue("coverImage", "");
    setCoverImageFileList([]);
  };

  /**
   * 多图移除处理
   */
  const handleImagesRemove = (file: UploadFile) => {
    const currentImages = form.getFieldValue("images") || [];
    const newImages = currentImages.filter((url: string) => url !== file.url);
    form.setFieldValue("images", newImages);
    setImagesFileList(imagesFileList.filter((f) => f.uid !== file.uid));
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
          label="英文名称"
          name="nameEn"
          rules={[{ max: 100, message: "英文名称最多 100 个字符" }]}
        >
          <Input
            placeholder="请输入英文名称（选填）"
            maxLength={100}
            showCount
          />
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

        <Space.Compact style={{ width: "100%" }}>
          <Form.Item
            label="最低价格"
            name="minPrice"
            rules={[
              { required: true, message: "请输入最低价格" },
              { type: "number", min: 0, message: "价格不能小于 0" },
            ]}
            style={{ width: "50%", marginBottom: 0 }}
          >
            <Input
              type="number"
              placeholder="请输入最低价格"
              prefix="¥"
              suffix="/晚"
            />
          </Form.Item>

          <Form.Item
            label="开业时间"
            name="openTime"
            style={{ width: "50%", marginBottom: 0 }}
          >
            <Input placeholder="请输入开业时间（选填）" />
          </Form.Item>
        </Space.Compact>

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

        <Form.Item label="酒店标签" name="tags">
          <Select
            mode="tags"
            placeholder="请输入标签，按回车添加（选填）"
            maxTagCount={10}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Divider />

        {/* 图片上传区域 */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>图片管理</span>
        </div>

        <Form.Item label="封面图片" name="coverImage">
          <Upload
            listType="picture-card"
            fileList={coverImageFileList}
            customRequest={handleCoverImageUpload}
            onRemove={handleCoverImageRemove}
            maxCount={1}
            accept="image/*"
          >
            {coverImageFileList.length === 0 && (
              <div>
                <div style={{ marginTop: 8 }}>上传封面</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="酒店图片" name="images">
          <Upload
            listType="picture-card"
            fileList={imagesFileList}
            customRequest={handleImagesUpload}
            onRemove={handleImagesRemove}
            multiple
            maxCount={10}
            accept="image/*"
          >
            <div>
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HotelCreateModal;

/**
 * 房型表单弹窗组件
 * 支持新增和编辑房型
 */

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, message, Space } from "antd";
import type { FormInstance } from "antd/es/form";
import type { RoomType, CreateRoomRequest, UpdateRoomRequest } from "../types";
import { createRoom, updateRoom } from "../services/hotelService";

const { TextArea } = Input;

// ==================== 常用标签 ====================

/** 常用房型标签 */
const COMMON_TAGS = [
  "含早",
  "免费取消",
  "可加床",
  "免费WiFi",
  "空调",
  "电视",
  "独立卫浴",
  "24小时热水",
  "免费停车",
  "接机服务",
];

// ==================== 组件 Props ====================

export interface RoomTypeFormModalProps {
  hotelId: string;
  room?: RoomType; // 编辑时传入
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

// ==================== 组件定义 ====================

/**
 * 房型表单弹窗组件
 */
const RoomTypeFormModal: React.FC<RoomTypeFormModalProps> = ({
  hotelId,
  room,
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const isEdit = !!room;

  /**
   * 弹窗打开时回填表单
   */
  useEffect(() => {
    if (open && room) {
      form.setFieldsValue({
        name: room.name,
        price: room.price,
        desc: room.desc,
        tags: room.tags || [],
      });
    } else if (open) {
      // 新增模式
      form.setFieldsValue({
        tags: [],
      });
    }
  }, [open, room, form]);

  /**
   * 添加标签
   */
  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const tags = form.getFieldValue("tags") || [];
    if (tags.includes(tagInput.trim())) {
      message.warning("该标签已存在");
      return;
    }

    form.setFieldValue("tags", [...tags, tagInput.trim()]);
    setTagInput("");
  };

  /**
   * 删除标签
   */
  const handleRemoveTag = (tagToRemove: string) => {
    const tags = form.getFieldValue("tags") || [];
    form.setFieldValue(
      "tags",
      tags.filter((tag: string) => tag !== tagToRemove)
    );
  };

  /**
   * 选择常用标签
   */
  const handleSelectCommonTag = (tag: string) => {
    const tags = form.getFieldValue("tags") || [];
    if (tags.includes(tag)) {
      message.warning("该标签已存在");
      return;
    }
    form.setFieldValue("tags", [...tags, tag]);
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    try {
      // 表单校验
      const values = await form.validateFields();
      console.log("[RoomTypeFormModal] 表单值:", values);

      setLoading(true);

      if (isEdit && room) {
        // 编辑模式
        const updateData: UpdateRoomRequest = {
          name: values.name,
          price: values.price,
          desc: values.desc,
          tags: values.tags,
        };
        await updateRoom(hotelId, room.roomId, updateData);
        message.success("房型更新成功");
      } else {
        // 新增模式
        const createData: CreateRoomRequest = {
          name: values.name,
          price: values.price,
          desc: values.desc,
          tags: values.tags,
        };
        await createRoom(hotelId, createData);
        message.success("房型创建成功");
      }

      // 触发成功回调
      onSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单校验失败
        message.warning("请检查表单填写是否正确");
      } else {
        // API 调用失败
        message.error(error.message || "操作失败，请稍后重试");
        console.error("房型操作失败:", error);
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
    setTagInput("");
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? "编辑房型" : "新增房型"}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
      okText="保存"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="房型名称"
          name="name"
          rules={[
            { required: true, message: "请输入房型名称" },
            { min: 2, max: 50, message: "房型名称长度为 2-50 个字符" },
          ]}
        >
          <Input placeholder="请输入房型名称" maxLength={50} showCount />
        </Form.Item>

        <Form.Item
          label="价格（元/晚）"
          name="price"
          rules={[
            { required: true, message: "请输入价格" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") {
                  return Promise.reject(new Error("请输入价格"));
                }
                if (value < 0) {
                  return Promise.reject(new Error("价格不能为负数"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            placeholder="请输入价格"
            min={0}
            precision={0}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="房型描述"
          name="desc"
          rules={[
            { required: true, message: "请输入房型描述" },
            { max: 500, message: "描述最多 500 个字符" },
          ]}
        >
          <TextArea
            placeholder="请输入房型描述"
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item label="房型标签" name="tags">
          <Form.Item noStyle shouldUpdate>
            {() => {
              const tags = form.getFieldValue("tags") || [];
              return (
                <div>
                  {/* 已选标签 */}
                  <div style={{ marginBottom: 8 }}>
                    {Array.isArray(tags) &&
                      tags.map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            margin: "0 4px 4px 0",
                            background: "#f0f0f0",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          {tag}
                          <span
                            style={{
                              marginLeft: 4,
                              cursor: "pointer",
                              color: "#999",
                            }}
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                  </div>

                  {/* 添加标签输入框 */}
                  <Input
                    placeholder="输入标签后按回车添加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onPressEnter={handleAddTag}
                    style={{ marginBottom: 8 }}
                  />

                  {/* 常用标签 */}
                  <div>
                    <span
                      style={{ fontSize: 12, color: "#999", marginRight: 8 }}
                    >
                      常用标签：
                    </span>
                    {COMMON_TAGS.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          margin: "0 4px 4px 0",
                          border: "1px solid #d9d9d9",
                          borderRadius: "4px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                        onClick={() => handleSelectCommonTag(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }}
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomTypeFormModal;

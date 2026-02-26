/**
 * 酒店编辑弹窗组件
 * 支持读取酒店详情与保存修改，以及房型管理
 */

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Space,
  Button,
  Card,
  Popconfirm,
  Empty,
  Divider,
} from "antd";
import type { FormInstance } from "antd/es/form";
import type { Hotel, HotelStar, RoomType } from "../types";
import {
  getHotelWithRooms,
  updateHotel,
  deleteRoom,
} from "../services/hotelService";
import RoomTypeFormModal from "./RoomTypeFormModal";
import type { RoomTypeFormModalProps } from "./RoomTypeFormModal";

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

export interface HotelEditModalProps {
  hotelId: string | null;
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

// ==================== 组件定义 ====================

/**
 * 酒店编辑弹窗组件
 */
const HotelEditModal: React.FC<HotelEditModalProps> = ({
  hotelId,
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  // 房型相关状态
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | undefined>();

  /**
   * 获取酒店详情并回填表单
   */
  useEffect(() => {
    if (open && hotelId) {
      fetchHotelDetail();
    }
  }, [open, hotelId]);

  /**
   * 获取酒店详情（含房型）
   */
  const fetchHotelDetail = async () => {
    if (!hotelId) return;

    setFetching(true);
    try {
      const { hotel, rooms: roomList } = await getHotelWithRooms(hotelId);
      if (!hotel) {
        message.error("酒店不存在");
        onCancel();
        return;
      }

      // 回填表单数据
      form.setFieldsValue({
        name: hotel.name,
        star: hotel.star,
        province: hotel.province,
        city: hotel.city,
        address: hotel.address,
        description: hotel.description,
      });

      // 设置房型列表
      setRooms(roomList);

      // 初始化城市列表
      if (hotel.province) {
        setCities(PROVINCE_CITY_MAP[hotel.province] || []);
      }
    } catch (error) {
      message.error("获取酒店详情失败");
      console.error("获取酒店详情失败:", error);
      onCancel();
    } finally {
      setFetching(false);
    }
  };

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
    if (!hotelId) {
      message.error("酒店 ID 不存在");
      return;
    }

    try {
      // 表单校验
      const values = await form.validateFields();
      console.log("[HotelEditModal] 表单值:", values);

      setLoading(true);

      // 构建更新数据
      const updateData: Partial<Hotel> = {
        name: values.name,
        star: values.star,
        province: values.province,
        city: values.city,
        address: values.address,
        description: values.description || "",
      };
      console.log("[HotelEditModal] 更新数据:", updateData);

      // 调用更新 API
      await updateHotel(hotelId, updateData);

      message.success("酒店更新成功");

      // 触发成功回调
      onSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单校验失败
        message.warning("请检查表单填写是否正确");
      } else {
        // API 调用失败
        message.error(error.message || "更新失败，请稍后重试");
        console.error("更新酒店失败:", error);
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
    setRooms([]);
    setEditingRoom(undefined);
    onCancel();
  };

  /**
   * 打开新增房型弹窗
   */
  const handleAddRoom = () => {
    setEditingRoom(undefined);
    setRoomFormOpen(true);
  };

  /**
   * 打开编辑房型弹窗
   */
  const handleEditRoom = (room: RoomType) => {
    setEditingRoom(room);
    setRoomFormOpen(true);
  };

  /**
   * 删除房型
   */
  const handleDeleteRoom = async (room: RoomType) => {
    if (!hotelId) return;

    try {
      await deleteRoom(hotelId, room.roomId);
      message.success("房型删除成功");
      // 刷新房型列表
      await fetchHotelDetail();
    } catch (error: any) {
      message.error(error.message || "删除房型失败");
      console.error("删除房型失败:", error);
    }
  };

  /**
   * 房型表单成功回调
   */
  const handleRoomFormSuccess = async () => {
    setRoomFormOpen(false);
    setEditingRoom(undefined);
    // 刷新房型列表
    await fetchHotelDetail();
  };

  /**
   * 房型表单取消回调
   */
  const handleRoomFormCancel = () => {
    setRoomFormOpen(false);
    setEditingRoom(undefined);
  };

  return (
    <>
      <Modal
        title="编辑酒店"
        open={open}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={800}
        destroyOnHidden
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" autoComplete="off">
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

          <Divider />

          {/* 房型管理区域 */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 500 }}>房型管理</span>
              <Button type="primary" size="small" onClick={handleAddRoom}>
                + 新增房型
              </Button>
            </div>

            {rooms.length === 0 ? (
              <Empty
                description="暂无房型"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: "20px 0" }}
              />
            ) : (
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {rooms.map((room) => (
                  <Card
                    key={room.roomId}
                    size="small"
                    style={{ marginBottom: 8 }}
                    bodyStyle={{ padding: "12px 16px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 4,
                          }}
                        >
                          {room.name}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            color: "#ff4d4f",
                            fontWeight: 500,
                            marginBottom: 4,
                          }}
                        >
                          ¥{room.price}/晚
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#999",
                            marginBottom: 4,
                          }}
                        >
                          {room.desc}
                        </div>
                        {room.tags && room.tags.length > 0 && (
                          <div>
                            {room.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  display: "inline-block",
                                  padding: "2px 6px",
                                  margin: "0 4px 4px 0",
                                  background: "#f0f0f0",
                                  borderRadius: "4px",
                                  fontSize: 11,
                                  color: "#666",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Space size="small">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => handleEditRoom(room)}
                        >
                          编辑
                        </Button>
                        <Popconfirm
                          title="确认删除"
                          description="确定要删除该房型吗？"
                          onConfirm={() => handleDeleteRoom(room)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button type="link" size="small" danger>
                            删除
                          </Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Form>
      </Modal>

      {/* 房型表单弹窗 */}
      {hotelId && (
        <RoomTypeFormModal
          hotelId={hotelId}
          room={editingRoom}
          open={roomFormOpen}
          onCancel={handleRoomFormCancel}
          onSuccess={handleRoomFormSuccess}
        />
      )}
    </>
  );
};

export default HotelEditModal;

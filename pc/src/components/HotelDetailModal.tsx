/**
 * 酒店详情弹窗组件
 * 展示酒店的完整信息
 */

import React, { useState, useEffect } from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Image,
  Spin,
  Empty,
  Divider,
  Typography,
} from "antd";
import { getHotelWithRooms } from "../services/hotelService";
import type { Hotel, RoomType } from "../types";

const { Title } = Typography;

interface HotelDetailModalProps {
  hotelId: string | null;
  open: boolean;
  onCancel: () => void;
}

/**
 * 星级渲染
 */
const StarDisplay: React.FC<{ star: number }> = ({ star }) => {
  return <span>{"⭐".repeat(star)}</span>;
};

/**
 * 审核状态标签
 */
const AuditStatusTag: React.FC<{
  status: Hotel["auditStatus"];
  reason?: string;
}> = ({ status }) => {
  const config: Record<Hotel["auditStatus"], { color: string; text: string }> =
    {
      pending: { color: "orange", text: "审核中" },
      approved: { color: "green", text: "通过" },
      rejected: { color: "red", text: "不通过" },
    };
  const { color, text } = config[status] || { color: "default", text: status };
  return <Tag color={color}>{text}</Tag>;
};

/**
 * 发布状态标签
 */
const PublishStatusTag: React.FC<{ status: Hotel["publishStatus"] }> = ({
  status,
}) => {
  const config: Record<
    Hotel["publishStatus"],
    { color: string; text: string }
  > = {
    draft: { color: "default", text: "未发布" },
    published: { color: "blue", text: "已发布" },
    offline: { color: "gray", text: "已下线" },
  };
  const { color, text } = config[status] || { color: "default", text: status };
  return <Tag color={color}>{text}</Tag>;
};

/**
 * 酒店详情弹窗组件
 */
const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotelId,
  open,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  // 加载酒店详情
  useEffect(() => {
    if (open && hotelId) {
      setLoading(true);
      getHotelWithRooms(hotelId)
        .then((data) => {
          setHotel(data.hotel);
          setRooms(data.rooms);
        })
        .catch((error) => {
          console.error("获取酒店详情失败:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setHotel(null);
      setRooms([]);
    }
  }, [open, hotelId]);

  return (
    <Modal
      title="酒店详情"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        {hotel ? (
          <>
            {/* 基本信息 */}
            <Descriptions title="基本信息" bordered column={2} size="small">
              <Descriptions.Item label="酒店名称">
                {hotel.name}
              </Descriptions.Item>
              <Descriptions.Item label="英文名称">
                {hotel.nameEn || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="星级">
                <StarDisplay star={hotel.star} />
              </Descriptions.Item>
              <Descriptions.Item label="最低价格">
                ¥{hotel.minPrice}/晚起
              </Descriptions.Item>
              <Descriptions.Item label="省份">
                {hotel.province}
              </Descriptions.Item>
              <Descriptions.Item label="城市">{hotel.city}</Descriptions.Item>
              <Descriptions.Item label="详细地址" span={2}>
                {hotel.address}
              </Descriptions.Item>
              <Descriptions.Item label="开业时间">
                {hotel.openTime || "-"}
              </Descriptions.Item>
            </Descriptions>

            {/* 审核与发布状态 */}
            <Divider />
            <Descriptions title="审核与发布" bordered column={2} size="small">
              <Descriptions.Item label="审核状态">
                <AuditStatusTag
                  status={hotel.auditStatus}
                  reason={hotel.auditReason}
                />
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <PublishStatusTag status={hotel.publishStatus} />
              </Descriptions.Item>
              {hotel.auditReason && hotel.auditStatus === "rejected" && (
                <Descriptions.Item label="不通过原因" span={2}>
                  <span style={{ color: "#ff4d4f" }}>{hotel.auditReason}</span>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="上传人">
                {hotel.merchantName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(hotel.createdAt).toLocaleString("zh-CN")}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {new Date(hotel.updatedAt).toLocaleString("zh-CN")}
              </Descriptions.Item>
            </Descriptions>

            {/* 统计数据 */}
            <Divider />
            <Descriptions title="统计数据" bordered column={3} size="small">
              <Descriptions.Item label="评分">
                <span style={{ color: "#faad14", fontWeight: "bold" }}>
                  {hotel.rating.toFixed(1)}
                </span>
                /5.0
              </Descriptions.Item>
              <Descriptions.Item label="评论数">
                {hotel.reviewCount} 条
              </Descriptions.Item>
              <Descriptions.Item label="收藏数">
                {hotel.favoriteCount} 次
              </Descriptions.Item>
            </Descriptions>

            {/* 酒店描述 */}
            <Divider />
            <Title level={5}>酒店描述</Title>
            <p style={{ color: "#666" }}>{hotel.description || "暂无描述"}</p>

            {/* 酒店标签 */}
            {hotel.tags && hotel.tags.length > 0 && (
              <>
                <Divider />
                <Title level={5}>酒店标签</Title>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {hotel.tags.map((tag, index) => (
                    <Tag key={index} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </>
            )}

            {/* 封面图片 */}
            {hotel.coverImage && (
              <>
                <Divider />
                <Title level={5}>封面图片</Title>
                <Image
                  src={hotel.coverImage}
                  width={300}
                  height={200}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                  placeholder
                />
              </>
            )}

            {/* 酒店图片 */}
            {hotel.images && hotel.images.length > 0 && (
              <>
                <Divider />
                <Title level={5}>酒店图片</Title>
                <Image.PreviewGroup>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {hotel.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        width={150}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                        placeholder
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              </>
            )}

            {/* 酒店设施 */}
            {hotel.facilities && hotel.facilities.length > 0 && (
              <>
                <Divider />
                <Title level={5}>酒店设施</Title>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {hotel.facilities.map((facility) => (
                    <Tag key={facility.id} color="blue">
                      {facility.name}
                    </Tag>
                  ))}
                </div>
              </>
            )}

            {/* 房型列表 */}
            {rooms.length > 0 && (
              <>
                <Divider />
                <Title level={5}>房型列表</Title>
                <Descriptions bordered column={1} size="small">
                  {rooms.map((room, index) => (
                    <Descriptions.Item
                      key={room.roomId}
                      label={`房型 ${index + 1}`}
                    >
                      <div>
                        <strong>{room.name}</strong>
                        <span style={{ marginLeft: 16, color: "#1890ff" }}>
                          ¥{room.price}/晚
                        </span>
                        {room.tags && room.tags.length > 0 && (
                          <div style={{ marginTop: 4 }}>
                            {room.tags.map((tag, tagIndex) => (
                              <Tag key={tagIndex} style={{ marginBottom: 4 }}>
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        )}
                        {room.desc && (
                          <div style={{ marginTop: 4, color: "#666" }}>
                            {room.desc}
                          </div>
                        )}
                      </div>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </>
            )}
          </>
        ) : (
          <Empty description="暂无数据" />
        )}
      </Spin>
    </Modal>
  );
};

export default HotelDetailModal;

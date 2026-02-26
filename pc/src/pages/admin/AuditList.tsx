/**
 * 管理员审核列表页
 * 展示全量酒店，支持分页、审核和发布操作
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Empty,
  Tooltip,
  message,
  Modal,
  Input,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import type { Hotel } from "../../types";
import {
  getAllHotels,
  approveHotel,
  rejectHotel,
  publishHotel,
  offlineHotel,
  onlineHotel,
} from "../../services/hotelService";
import HotelDetailModal from "../../components/HotelDetailModal";

// 分页配置
const DEFAULT_PAGE_SIZE = 10;

/**
 * 审核状态标签渲染
 */
const AuditStatusTag: React.FC<{
  status: Hotel["auditStatus"];
  reason?: string;
}> = ({ status, reason }) => {
  const config: Record<Hotel["auditStatus"], { color: string; text: string }> =
    {
      pending: { color: "orange", text: "审核中" },
      approved: { color: "green", text: "通过" },
      rejected: { color: "red", text: "不通过" },
    };

  const { color, text } = config[status] || { color: "default", text: status };

  if (status === "rejected" && reason) {
    return (
      <Tooltip title={`原因：${reason}`}>
        <Tag color={color}>{text}</Tag>
      </Tooltip>
    );
  }

  return <Tag color={color}>{text}</Tag>;
};

/**
 * 发布状态标签渲染
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
 * 星级渲染
 */
const StarDisplay: React.FC<{ star: number }> = ({ star }) => {
  return <span>{"⭐".repeat(star)}</span>;
};

/**
 * 管理员审核列表页面组件
 */
const AuditList: React.FC = () => {
  // 状态
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  // 审核相关状态
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  // 详情弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  /**
   * 加载酒店列表
   */
  const fetchHotels = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await getAllHotels({
        page,
        pageSize,
      });
      setHotels(response.list);
      setPagination((prev) => ({
        ...prev,
        current: response.page,
        total: response.total,
      }));
    } catch (error) {
      message.error("获取酒店列表失败");
      console.error("获取酒店列表失败:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    fetchHotels(1, DEFAULT_PAGE_SIZE);
  }, [fetchHotels]);

  /**
   * 分页变化处理
   */
  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    const { current = 1, pageSize = DEFAULT_PAGE_SIZE } = paginationConfig;
    fetchHotels(current, pageSize);
  };

  /**
   * 刷新列表
   */
  const handleRefresh = () => {
    fetchHotels(pagination.current, pagination.pageSize);
  };

  /**
   * 审核通过
   */
  const handleApprove = async (hotel: Hotel) => {
    try {
      setAuditLoading(true);
      await approveHotel(hotel.id);
      message.success("审核通过成功");
      // 刷新列表
      fetchHotels(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || "审核通过失败");
    } finally {
      setAuditLoading(false);
    }
  };

  /**
   * 打开审核不通过弹窗
   */
  const handleRejectClick = (hotel: Hotel) => {
    setCurrentHotel(hotel);
    setRejectReason("");
    setRejectModalVisible(true);
  };

  /**
   * 审核不通过
   */
  const handleRejectConfirm = async () => {
    if (!currentHotel) return;

    if (!rejectReason.trim()) {
      message.warning("请填写不通过原因");
      return;
    }

    try {
      setAuditLoading(true);
      await rejectHotel(currentHotel.id, rejectReason);
      message.success("审核不通过成功");
      setRejectModalVisible(false);
      setRejectReason("");
      setCurrentHotel(null);
      // 刷新列表
      fetchHotels(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || "审核不通过失败");
    } finally {
      setAuditLoading(false);
    }
  };

  /**
   * 取消审核不通过
   */
  const handleRejectCancel = () => {
    setRejectModalVisible(false);
    setRejectReason("");
    setCurrentHotel(null);
  };

  /**
   * 发布酒店
   */
  const handlePublish = async (hotel: Hotel) => {
    try {
      setAuditLoading(true);
      await publishHotel(hotel.id);
      message.success("发布成功");
      // 刷新列表
      fetchHotels(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || "发布失败");
    } finally {
      setAuditLoading(false);
    }
  };

  /**
   * 下线酒店
   */
  const handleOffline = async (hotel: Hotel) => {
    try {
      setAuditLoading(true);
      await offlineHotel(hotel.id);
      message.success("下线成功");
      // 刷新列表
      fetchHotels(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || "下线失败");
    } finally {
      setAuditLoading(false);
    }
  };

  /**
   * 上线酒店
   */
  const handleOnline = async (hotel: Hotel) => {
    try {
      setAuditLoading(true);
      await onlineHotel(hotel.id);
      message.success("上线成功");
      // 刷新列表
      fetchHotels(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || "上线失败");
    } finally {
      setAuditLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<Hotel> = [
    {
      title: "酒店名",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      render: (text: string, record: Hotel) => (
        <Tooltip title="点击查看详情">
          <span
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => {
              setSelectedHotelId(record.id);
              setDetailModalOpen(true);
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "星级",
      dataIndex: "star",
      key: "star",
      width: 100,
      align: "center",
      render: (star: number) => <StarDisplay star={star} />,
    },
    {
      title: "地址",
      key: "address",
      width: 250,
      ellipsis: true,
      render: (_: unknown, record: Hotel) => (
        <Tooltip title={record.address}>
          <span>
            {record.province} {record.city} {record.address}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "上传人",
      dataIndex: "merchantName",
      key: "merchantName",
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "审核状态",
      dataIndex: "auditStatus",
      key: "auditStatus",
      width: 100,
      align: "center",
      render: (status: Hotel["auditStatus"], record: Hotel) => (
        <AuditStatusTag status={status} reason={record.auditReason} />
      ),
    },
    {
      title: "发布状态",
      dataIndex: "publishStatus",
      key: "publishStatus",
      width: 100,
      align: "center",
      render: (status: Hotel["publishStatus"]) => (
        <PublishStatusTag status={status} />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString("zh-CN"),
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      align: "center",
      fixed: "right",
      render: (_: unknown, record: Hotel) => {
        // 审核中：显示审核按钮
        if (record.auditStatus === "pending") {
          return (
            <Space size="small">
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record)}
                loading={auditLoading}
                style={{ color: "#52c41a" }}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleRejectClick(record)}
                loading={auditLoading}
                style={{ color: "#ff4d4f" }}
              >
                不通过
              </Button>
            </Space>
          );
        }

        // 审核通过：根据发布状态显示不同按钮，同时显示不通过按钮
        if (record.auditStatus === "approved") {
          return (
            <Space size="small">
              {/* 未发布：显示发布按钮 */}
              {record.publishStatus === "draft" && (
                <Button
                  type="link"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={() => handlePublish(record)}
                  loading={auditLoading}
                  style={{ color: "#1890ff" }}
                >
                  发布
                </Button>
              )}
              {/* 已发布：显示下线按钮 */}
              {record.publishStatus === "published" && (
                <Button
                  type="link"
                  size="small"
                  icon={<StopOutlined />}
                  onClick={() => handleOffline(record)}
                  loading={auditLoading}
                  style={{ color: "#faad14" }}
                >
                  下线
                </Button>
              )}
              {/* 已下线：显示上线按钮 */}
              {record.publishStatus === "offline" && (
                <Button
                  type="link"
                  size="small"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleOnline(record)}
                  loading={auditLoading}
                  style={{ color: "#52c41a" }}
                >
                  上线
                </Button>
              )}
              {/* 不通过按钮 */}
              <Button
                type="link"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleRejectClick(record)}
                loading={auditLoading}
                style={{ color: "#ff4d4f" }}
              >
                不通过
              </Button>
            </Space>
          );
        }

        // 审核不通过：显示通过按钮
        if (record.auditStatus === "rejected") {
          return (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record)}
              loading={auditLoading}
              style={{ color: "#52c41a" }}
            >
              通过
            </Button>
          );
        }

        return <span style={{ color: "#999" }}>-</span>;
      },
    },
  ];

  return (
    <div className="audit-list-page">
      <Card
        title="酒店审核列表"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            刷新
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={hotels}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSizeOptions: ["10"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: (
              <Empty
                description="暂无酒店数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* 审核不通过弹窗 */}
      <Modal
        title="审核不通过"
        open={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={handleRejectCancel}
        okText="确认提交"
        cancelText="取消"
        confirmLoading={auditLoading}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            请填写不通过原因：
          </label>
          <Input.TextArea
            rows={4}
            placeholder="请输入不通过的原因，例如：酒店信息不完整、图片不清晰等"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            maxLength={200}
            showCount
          />
        </div>
      </Modal>

      {/* 酒店详情弹窗 */}
      <HotelDetailModal
        hotelId={selectedHotelId}
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedHotelId(null);
        }}
      />
    </div>
  );
};

export default AuditList;

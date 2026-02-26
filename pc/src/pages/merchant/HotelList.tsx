/**
 * 酒店列表页
 * 商户和管理员：都只展示自己上传的酒店
 */

import React, { useState, useEffect, useCallback } from "react";
import { Table, Card, Button, Tag, Space, Empty, Tooltip, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SendOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import type { Hotel } from "../../types";
import {
  getMerchantHotels,
  publishHotel,
  offlineHotel,
  onlineHotel,
} from "../../services/hotelService";
import useUserStore from "../../store/userStore";
import HotelCreateModal from "../../components/HotelCreateModal";
import HotelEditModal from "../../components/HotelEditModal";
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
 * 商户酒店列表页面组件
 */
const HotelList: React.FC = () => {
  // 状态
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // 获取当前用户信息
  const { user } = useUserStore();

  /**
   * 加载酒店列表
   * 商户和管理员：都只加载自己的酒店
   */
  const fetchHotels = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);
      try {
        const response = await getMerchantHotels({
          page,
          pageSize,
          merchantId: user?.userid,
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
    },
    [user?.userid]
  );

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
   * 编辑酒店
   */
  const handleEdit = (record: Hotel) => {
    setSelectedHotelId(record.id);
    setEditModalOpen(true);
  };

  /**
   * 编辑酒店成功回调
   */
  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedHotelId(null);
    // 刷新列表
    fetchHotels(pagination.current, pagination.pageSize);
  };

  /**
   * 打开新建酒店弹窗
   */
  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  /**
   * 新建酒店成功回调
   */
  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    // 刷新列表
    fetchHotels(pagination.current, pagination.pageSize);
  };

  /**
   * 发布酒店
   */
  const handlePublish = async (hotelId: string) => {
    try {
      await publishHotel(hotelId);
      message.success("酒店发布成功");
      // 刷新列表
      fetchHotels(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || "发布失败");
    }
  };

  /**
   * 下线酒店
   */
  const handleOffline = async (hotelId: string) => {
    try {
      await offlineHotel(hotelId);
      message.success("酒店下线成功");
      // 刷新列表
      fetchHotels(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || "下线失败");
    }
  };

  /**
   * 上线酒店
   */
  const handleOnline = async (hotelId: string) => {
    try {
      await onlineHotel(hotelId);
      message.success("酒店上线成功");
      // 刷新列表
      fetchHotels(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || "上线失败");
    }
  };

  /**
   * 判断是否可以发布
   * 只有审核通过且未发布的酒店可以发布
   */
  const canPublish = (hotel: Hotel): boolean => {
    return hotel.auditStatus === "approved" && hotel.publishStatus === "draft";
  };

  /**
   * 判断是否可以下线
   * 只有已发布的酒店可以下线
   */
  const canOffline = (hotel: Hotel): boolean => {
    return hotel.publishStatus === "published";
  };

  /**
   * 判断是否可以上线
   * 只有已下线的酒店可以上线
   */
  const canOnline = (hotel: Hotel): boolean => {
    return hotel.publishStatus === "offline";
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
      width: 280,
      fixed: "right",
      render: (_: unknown, record: Hotel) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {canPublish(record) && (
            <Button
              type="link"
              size="small"
              icon={<SendOutlined />}
              onClick={() => handlePublish(record.id)}
            >
              发布
            </Button>
          )}
          {canOffline(record) && (
            <Button
              type="link"
              size="small"
              icon={<StopOutlined />}
              onClick={() => handleOffline(record.id)}
            >
              下线
            </Button>
          )}
          {canOnline(record) && (
            <Button
              type="link"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleOnline(record.id)}
            >
              上线
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="hotel-list-page">
      <Card
        title="我的酒店"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建酒店
            </Button>
          </Space>
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
          scroll={{ x: 1400 }}
          locale={{
            emptyText: (
              <Empty
                description="暂无酒店数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  新建酒店
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* 新建酒店弹窗 */}
      <HotelCreateModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* 编辑酒店弹窗 */}
      <HotelEditModal
        hotelId={selectedHotelId}
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedHotelId(null);
        }}
        onSuccess={handleEditSuccess}
      />

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

export default HotelList;

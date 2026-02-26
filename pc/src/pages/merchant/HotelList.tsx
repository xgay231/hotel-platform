/**
 * 商户酒店列表页
 * 展示当前商户上传的酒店，支持分页
 */

import React, { useState, useEffect, useCallback } from "react";
import { Table, Card, Button, Tag, Space, Empty, Tooltip, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { Hotel } from "../../types";
import { AuditStatus, PublishStatus } from "../../types";
import { getMerchantHotels } from "../../services/hotelService";
import useUserStore from "../../store/userStore";

// 分页配置
const DEFAULT_PAGE_SIZE = 15;

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
    offline: { color: "warning", text: "已下线" },
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

  // 获取当前用户信息
  const { user } = useUserStore();

  /**
   * 加载酒店列表
   */
  const fetchHotels = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);
      try {
        const response = await getMerchantHotels({
          page,
          pageSize,
          merchantId: user?.userid, // 传递当前商户 ID
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
   * 查看酒店详情
   */
  const handleView = (record: Hotel) => {
    message.info(`查看酒店：${record.name}`);
    // TODO: 跳转到详情页或打开详情弹窗
  };

  /**
   * 编辑酒店
   */
  const handleEdit = (record: Hotel) => {
    message.info(`编辑酒店：${record.name}`);
    // TODO: 跳转到编辑页或打开编辑弹窗
  };

  // 表格列定义
  const columns: ColumnsType<Hotel> = [
    {
      title: "酒店名",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
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
        <AuditStatusTag status={status} reason={record.rejectReason} />
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
      width: 150,
      fixed: "right",
      render: (_: unknown, record: Hotel) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
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
            <Button type="primary" icon={<PlusOutlined />}>
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
            pageSizeOptions: ["15"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: (
              <Empty
                description="暂无酒店数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" icon={<PlusOutlined />}>
                  新建酒店
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default HotelList;

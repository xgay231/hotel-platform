import { View, Text, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import "./index.scss";

interface ListHeaderProps {
  province?: string;
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  keyword?: string;
  onKeywordChange: (keyword: string) => void;
  onSearch: () => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({
  province,
  city,
  checkInDate,
  checkOutDate,
  keyword,
  onKeywordChange,
  onSearch,
}) => {
  // 计算间夜数
  const calculateNights = (): number => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();

  // 格式化日期显示
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  // 处理返回
  const handleBack = () => {
    Taro.navigateBack();
  };

  // 处理搜索
  const handleSearch = () => {
    onSearch();
  };

  // 处理输入确认
  const handleConfirm = () => {
    onSearch();
  };

  return (
    <View className="list-header">
      {/* 返回按钮 */}
      <View className="header-back" onClick={handleBack}>
        <Text className="back-icon"> </Text>
      </View>

      {/* 地点显示 */}
      <View className="header-location">
        <Text className="location-text">{city || province || "选择地点"}</Text>
      </View>

      {/* 日期信息 */}
      <View className="header-date">
        <View className="date-row">
          <Text className="date-label">入住</Text>
          <Text className="date-value">{formatDate(checkInDate)}</Text>
        </View>
        <View className="date-row">
          <Text className="date-label">离店</Text>
          <Text className="date-value">{formatDate(checkOutDate)}</Text>
        </View>
        {nights > 0 && (
          <View className="nights-badge">
            <Text className="nights-text">共{nights}晚</Text>
          </View>
        )}
      </View>

      {/* 搜索栏 */}
      <View className="header-search">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索酒店名称/位置/品牌"
            value={keyword}
            onInput={(e) => onKeywordChange(e.detail.value)}
            onConfirm={handleConfirm}
            placeholderClass="search-placeholder"
          />
        </View>
      </View>
    </View>
  );
};

export default ListHeader;

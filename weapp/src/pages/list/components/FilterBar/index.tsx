import { View, Text } from "@tarojs/components";
import React from "react";
import "./index.scss";

interface FilterBarProps {
  sortBy: "" | "priceAsc" | "priceDesc" | "ratingDesc";
  province?: string;
  city?: string;
  minPrice: number;
  maxPrice: number;
  starLevel: number;
  selectedTags: string[];
  onSortClick: () => void;
  onLocationClick: () => void;
  onPriceStarClick: () => void;
  onDetailClick: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  province,
  city,
  minPrice,
  maxPrice,
  starLevel,
  selectedTags,
  onSortClick,
  onLocationClick,
  onPriceStarClick,
  onDetailClick,
}) => {
  // 获取排序显示文本
  const getSortText = (): string => {
    if (sortBy === "ratingDesc") return "好评优先";
    if (sortBy === "priceDesc") return "高价优先";
    if (sortBy === "priceAsc") return "低价优先";
    return "排序";
  };

  // 获取位置显示文本
  const getLocationText = (): string => {
    if (city) return city;
    if (province) return province;
    return "位置";
  };

  // 获取价格星级显示文本
  const getPriceStarText = (): string => {
    const hasPrice = minPrice > 0 || maxPrice < 1500;
    const hasStar = starLevel > 0;
    if (hasPrice && hasStar) return "价格/星级";
    if (hasPrice) return "价格";
    if (hasStar) return "星级";
    return "价格/星级";
  };

  // 获取详细筛选显示文本
  const getDetailText = (): string => {
    if (selectedTags.length > 0) {
      return `筛选(${selectedTags.length})`;
    }
    return "筛选";
  };

  return (
    <View className="filter-bar">
      {/* 排序按钮 */}
      <View className="filter-item" onClick={onSortClick}>
        <Text className={`filter-text ${sortBy ? "active" : ""}`}>
          {getSortText()}
        </Text>
        <Text className={`filter-arrow ${sortBy ? "active" : ""}`}>▼</Text>
      </View>

      {/* 位置距离按钮 */}
      <View className="filter-item" onClick={onLocationClick}>
        <Text className={`filter-text ${province || city ? "active" : ""}`}>
          {getLocationText()}
        </Text>
        <Text className={`filter-arrow ${province || city ? "active" : ""}`}>
          ▼
        </Text>
      </View>

      {/* 价格/星级按钮 */}
      <View className="filter-item" onClick={onPriceStarClick}>
        <Text
          className={`filter-text ${
            minPrice > 0 || maxPrice < 1500 || starLevel > 0 ? "active" : ""
          }`}
        >
          {getPriceStarText()}
        </Text>
        <Text
          className={`filter-arrow ${
            minPrice > 0 || maxPrice < 1500 || starLevel > 0 ? "active" : ""
          }`}
        >
          ▼
        </Text>
      </View>

      {/* 详细筛选按钮 */}
      <View className="filter-item" onClick={onDetailClick}>
        <Text
          className={`filter-text ${selectedTags.length > 0 ? "active" : ""}`}
        >
          {getDetailText()}
        </Text>
        <Text
          className={`filter-arrow ${selectedTags.length > 0 ? "active" : ""}`}
        >
          ▼
        </Text>
      </View>
    </View>
  );
};

export default FilterBar;

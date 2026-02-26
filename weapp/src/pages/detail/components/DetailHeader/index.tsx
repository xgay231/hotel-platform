import { View, Text, Image } from "@tarojs/components";
import React from "react";
import "./index.scss";

interface DetailHeaderProps {
  hotelName: string;
  isFavorite?: boolean;
  onBack: () => void;
  onToggleFavorite?: () => void;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  hotelName,
  isFavorite = false,
  onBack,
  onToggleFavorite,
}) => {
  return (
    <View className="detail-header">
      {/* 返回按钮 */}
      <View className="header-left" onClick={onBack}>
        <Text className="back-icon">  </Text>
      </View>

      {/* 酒店名称 */}
      <View className="header-center">
        <Text className="hotel-name">{hotelName}</Text>
      </View>

      {/* 收藏按钮 */}
      <View className="header-right" onClick={onToggleFavorite}>
        <Text className={`favorite-icon ${isFavorite ? "active" : ""}`}>
          {isFavorite ? "★" : "☆"}
        </Text>
      </View>
    </View>
  );
};

export default DetailHeader;

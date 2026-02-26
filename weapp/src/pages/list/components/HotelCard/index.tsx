import { View, Text, Image } from "@tarojs/components";
import React from "react";
import { normalizeAssetUrl } from "../../../../services/config";
import type { HotelListItem } from "../../../../types/hotel";
import "./index.scss";

interface HotelCardProps {
  hotel: HotelListItem;
  onClick: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  // 渲染星级
  const renderStars = (star: number) => {
    const stars: React.ReactNode[] = [];
    for (let i = 0; i < star; i++) {
      stars.push(
        <Text key={i} className="star-icon">
          ★
        </Text>
      );
    }
    return stars;
  };

  // 渲染标签（最多显示3个）
  const renderTags = (tags: string[]) => {
    const displayTags = tags.slice(0, 3);
    return displayTags.map((tag, index) => (
      <Text key={index} className="tag">
        {tag}
      </Text>
    ));
  };

  return (
    <View className="hotel-card" onClick={onClick}>
      {/* 左侧图片 */}
      <View className="card-left">
        <Image
          className="hotel-image"
          src={normalizeAssetUrl(hotel.cover_image)}
          mode="aspectFill"
        />
      </View>

      {/* 右侧信息 */}
      <View className="card-right">
        {/* 第一行：酒店名称 + 星级 */}
        <View className="name-row">
          <Text className="hotel-name">{hotel.name_cn}</Text>
          <View className="star-row">{renderStars(hotel.star)}</View>
        </View>

        {/* 第二行：评分 + 点评数 */}
        <View className="rating-row">
          <View className="rating-wrap">
            <Text className="rating-score">{hotel.rating || 0}</Text>
            <Text className="rating-label">分</Text>
          </View>
          <Text className="review-count">1234条点评</Text>
        </View>

        {/* 第三行：地点 */}
        <View className="address-row">
          <Text className="address">{hotel.address}</Text>
        </View>

        {/* 第四行：酒店描述 */}
        <View className="desc-row">
          <Text className="desc">豪华商务酒店，交通便利</Text>
        </View>

        {/* 第五行：标签 + 价格 */}
        <View className="bottom-row">
          <View className="tags-wrap">{renderTags(hotel.tags)}</View>
          <View className="price-wrap">
            <Text className="price-symbol">¥</Text>
            <Text className="price-value">{hotel.min_price}</Text>
            <Text className="price-suffix">起</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HotelCard;

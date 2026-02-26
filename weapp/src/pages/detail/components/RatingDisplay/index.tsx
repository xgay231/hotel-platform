import { View, Text } from "@tarojs/components";
import React from "react";
import "./index.scss";

interface RatingDisplayProps {
  rating: number;
  reviewCount: number;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
}) => {
  // 渲染星级
  const renderStars = (score: number) => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;

    // 实心星
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={`full-${i}`} className="star-icon full">
          ★
        </Text>
      );
    }

    // 半星
    if (hasHalfStar) {
      stars.push(
        <Text key="half" className="star-icon half">
          ★
        </Text>
      );
    }

    // 空星
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text key={`empty-${i}`} className="star-icon empty">
          ★
        </Text>
      );
    }

    return stars;
  };

  return (
    <View className="rating-display">
      <View className="rating-left">
        <Text className="rating-score">{rating.toFixed(1)}</Text>
        <Text className="rating-label">分</Text>
      </View>
      <View className="rating-stars">{renderStars(rating)}</View>
      <Text className="review-count">{reviewCount}条点评</Text>
    </View>
  );
};

export default RatingDisplay;

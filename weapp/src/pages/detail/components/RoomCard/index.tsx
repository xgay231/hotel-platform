import { View, Text, Button } from "@tarojs/components";
import React from "react";
import type { RoomType } from "../../../../types/hotel";
import "./index.scss";

interface RoomCardProps {
  room: RoomType;
  onBook: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  // 渲染房型标签（最多显示3个）
  const renderTags = (tags: string[]) => {
    const displayTags = tags.slice(0, 3);
    return displayTags.map((tag, index) => (
      <Text key={index} className="room-tag">
        {tag}
      </Text>
    ));
  };

  return (
    <View className="room-card">
      <View className="room-left">
        <Text className="room-name">{room.name}</Text>
        <Text className="room-desc">{room.desc}</Text>
        {room.tags && room.tags.length > 0 && (
          <View className="room-tags">{renderTags(room.tags)}</View>
        )}
      </View>
      <View className="room-right">
        <View className="price-wrap">
          <Text className="price-symbol">¥</Text>
          <Text className="price-value">{room.price}</Text>
          <Text className="price-unit">/晚</Text>
        </View>
        <Button
          className="book-btn"
          size="mini"
          onClick={() => onBook(room.room_id)}
        >
          预订
        </Button>
      </View>
    </View>
  );
};

export default RoomCard;

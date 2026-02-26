import { View, Text, ScrollView } from "@tarojs/components";
import React from "react";
import "./index.scss";

// Tag分类配置
const DETAIL_TAG_CATEGORIES = [
  {
    category: "设施",
    tags: ["免费停车场", "免费WiFi", "健身房", "游泳池", "SPA", "会议室"],
  },
  {
    category: "服务",
    tags: ["含早餐", "接送机", "行李寄存", "24小时前台", "叫醒服务"],
  },
  {
    category: "特色",
    tags: ["亲子", "商务", "度假", "近地铁", "机场附近"],
  },
];

interface DetailFilterProps {
  visible: boolean;
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  onClose: () => void;
}

const DetailFilter: React.FC<DetailFilterProps> = ({
  visible,
  selectedTags,
  onChange,
  onClose,
}) => {
  if (!visible) return null;

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const handleReset = () => {
    onChange([]);
  };

  const handleConfirm = () => {
    onClose();
  };

  return (
    <View className="detail-filter-mask" onClick={onClose}>
      <View
        className="detail-filter-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <View className="filter-header">
          <Text className="filter-title">详细筛选</Text>
          <Text className="filter-close" onClick={onClose}>
            ✕
          </Text>
        </View>

        {/* 标签列表 */}
        <ScrollView scrollY className="filter-body">
          {DETAIL_TAG_CATEGORIES.map((category) => (
            <View key={category.category} className="category-section">
              <Text className="category-title">{category.category}</Text>
              <View className="tags-grid">
                {category.tags.map((tag) => (
                  <View
                    key={tag}
                    className={`tag-item ${
                      selectedTags.includes(tag) ? "active" : ""
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    <Text className="tag-text">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 底部按钮 */}
        <View className="filter-footer">
          <View className="footer-btn reset-btn" onClick={handleReset}>
            <Text className="btn-text">重置</Text>
          </View>
          <View className="footer-btn confirm-btn" onClick={handleConfirm}>
            <Text className="btn-text">确定</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DetailFilter;

import { View, Text, ScrollView } from "@tarojs/components";
import React from "react";
import "./index.scss";

interface DetailFilterProps {
  visible: boolean;
  availableTags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  onClose: () => void;
}

const DetailFilter: React.FC<DetailFilterProps> = ({
  visible,
  availableTags,
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
          {availableTags.length === 0 ? (
            <View className="empty-wrap">
              <Text className="empty-text">暂无可筛选标签</Text>
            </View>
          ) : (
            <View className="tags-grid">
              {availableTags.map((tag) => (
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
          )}
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

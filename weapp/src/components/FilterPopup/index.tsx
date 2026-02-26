import { View, Text, Slider } from "@tarojs/components";
import React, { useState, useEffect } from "react";
import "./index.scss";

interface FilterPopupProps {
  visible: boolean;
  minPrice: number;
  maxPrice: number;
  starLevel: number;
  onClose: () => void;
  onConfirm: (minPrice: number, maxPrice: number, starLevel: number) => void;
}

// 价格档位配置
const PRICE_STEPS = [
  0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,
  1500,
];
const MAX_PRICE_LABEL = "1500+";

const FilterPopup: React.FC<FilterPopupProps> = ({
  visible,
  minPrice,
  maxPrice,
  starLevel,
  onClose,
  onConfirm,
}) => {
  // 内部状态
  const [localMinPrice, setLocalMinPrice] = useState<number>(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(maxPrice);
  const [localStarLevel, setLocalStarLevel] = useState<number>(starLevel);

  // 当弹窗打开时，重置为传入的值
  useEffect(() => {
    if (visible) {
      setLocalMinPrice(minPrice);
      setLocalMaxPrice(maxPrice);
      setLocalStarLevel(starLevel);
    }
  }, [visible, minPrice, maxPrice, starLevel]);

  // 处理最小价格滑块
  const handleMinPriceChange = (value: number) => {
    const stepValue = Math.round(value / 100) * 100;
    // 确保最小价格不超过最大价格
    if (stepValue <= localMaxPrice) {
      setLocalMinPrice(stepValue);
    }
  };

  // 处理最大价格滑块
  const handleMaxPriceChange = (value: number) => {
    const stepValue = Math.round(value / 100) * 100;
    // 确保最大价格不小于最小价格
    if (stepValue >= localMinPrice) {
      setLocalMaxPrice(stepValue);
    }
  };

  // 处理星级选择
  const handleStarClick = (level: number) => {
    // 如果点击当前选中的星级，则取消选择
    if (localStarLevel === level) {
      setLocalStarLevel(0);
    } else {
      setLocalStarLevel(level);
    }
  };

  // 重置所有筛选条件
  const handleReset = () => {
    setLocalMinPrice(0);
    setLocalMaxPrice(1500);
    setLocalStarLevel(0);
  };

  // 确认筛选
  const handleConfirm = () => {
    onConfirm(localMinPrice, localMaxPrice, localStarLevel);
    onClose();
  };

  // 渲染星级
  const renderStars = () => {
    const stars: React.ReactNode[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          className={`star-icon ${i <= localStarLevel ? "active" : ""}`}
          onClick={() => handleStarClick(i)}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  if (!visible) return null;

  return (
    <View className="filter-popup-mask" onClick={onClose}>
      <View
        className="filter-popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <View className="popup-header">
          <Text className="popup-title">筛选条件</Text>
          <Text className="popup-close" onClick={onClose}>
            ✕
          </Text>
        </View>

        {/* 价格区间 */}
        <View className="filter-section">
          <Text className="section-title">价格区间</Text>
          <View className="price-display">
            <Text className="price-value">
              ¥{localMinPrice} -{" "}
              {localMaxPrice >= 1500 ? MAX_PRICE_LABEL : `¥${localMaxPrice}`}
            </Text>
          </View>
          <View className="slider-container">
            <View className="slider-row">
              <Text className="slider-label">最低</Text>
              <Slider
                className="price-slider"
                min={0}
                max={1500}
                step={100}
                value={localMinPrice}
                activeColor="#007aff"
                backgroundColor="#e0e0e0"
                blockColor="#007aff"
                block-size={16}
                onChange={(e) => handleMinPriceChange(e.detail.value)}
              />
            </View>
            <View className="slider-row">
              <Text className="slider-label">最高</Text>
              <Slider
                className="price-slider"
                min={0}
                max={1500}
                step={100}
                value={localMaxPrice}
                activeColor="#007aff"
                backgroundColor="#e0e0e0"
                blockColor="#007aff"
                block-size={16}
                onChange={(e) => handleMaxPriceChange(e.detail.value)}
              />
            </View>
          </View>
          <View className="price-labels">
            <Text className="price-label">¥0</Text>
            <Text className="price-label">{MAX_PRICE_LABEL}</Text>
          </View>
        </View>

        {/* 酒店星级 */}
        <View className="filter-section">
          <Text className="section-title">酒店星级</Text>
          <View className="star-selector">
            {renderStars()}
            <Text
              className={`reset-star ${localStarLevel > 0 ? "visible" : ""}`}
              onClick={() => setLocalStarLevel(0)}
            >
              清除
            </Text>
          </View>
          <View className="star-hint">
            <Text className="hint-text">
              {localStarLevel === 0 ? "不限" : `${localStarLevel}星及以上`}
            </Text>
          </View>
        </View>

        {/* 底部按钮 */}
        <View className="popup-footer">
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

export default FilterPopup;

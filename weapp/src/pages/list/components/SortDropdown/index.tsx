import { View, Text } from "@tarojs/components";
import React from "react";
import "./index.scss";

interface SortOption {
  label: string;
  value: "" | "priceAsc" | "priceDesc" | "ratingDesc";
}

interface SortDropdownProps {
  visible: boolean;
  value: "" | "priceAsc" | "priceDesc" | "ratingDesc";
  onChange: (value: "" | "priceAsc" | "priceDesc" | "ratingDesc") => void;
  onClose: () => void;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "好评优先", value: "ratingDesc" },
  { label: "高价优先", value: "priceDesc" },
  { label: "低价优先", value: "priceAsc" },
];

const SortDropdown: React.FC<SortDropdownProps> = ({
  visible,
  value,
  onChange,
  onClose,
}) => {
  if (!visible) return null;

  const handleOptionClick = (option: SortOption) => {
    onChange(option.value);
    onClose();
  };

  return (
    <View className="sort-dropdown-mask" onClick={onClose}>
      <View
        className="sort-dropdown-content"
        onClick={(e) => e.stopPropagation()}
      >
        {SORT_OPTIONS.map((option) => (
          <View
            key={option.value}
            className={`sort-option ${value === option.value ? "active" : ""}`}
            onClick={() => handleOptionClick(option)}
          >
            <Text className="option-label">{option.label}</Text>
            {value === option.value && <Text className="option-check">✓</Text>}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SortDropdown;

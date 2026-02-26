import {
  View,
  Image,
  Swiper,
  SwiperItem,
  Input,
  Text,
  Button,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import Calendar from "../../components/Calendar";
import FilterPopup from "../../components/FilterPopup";
import RegionPicker from "../../components/RegionPicker";
import { getBanners } from "../../services";
import type { BannerItem } from "../../types/hotel";
import fallbackBannerImage from "../../images/pic1.png";
import { normalizeAssetUrl } from "../../services/config";
import "./index.scss";

// 快捷标签配置
const QUICK_TAGS = [
  { id: "family", label: "亲子" },
  { id: "luxury", label: "豪华" },
  { id: "parking", label: "免费停车场" },
  { id: "breakfast", label: "含早餐" },
];

const HotelQueryPage = () => {
  // ========== 原有逻辑保持不变 ==========
  const [bannerList, setBannerList] = useState<BannerItem[]>([]);
  const [bannerLoading, setBannerLoading] = useState<boolean>(false);
  const [bannerLoadFailed, setBannerLoadFailed] = useState<boolean>(false);

  useEffect(() => {
    const fetchBannerList = async () => {
      setBannerLoading(true);
      setBannerLoadFailed(false);
      try {
        const data = await getBanners();
        setBannerList(data || []);
      } catch (error) {
        setBannerLoadFailed(true);
        setBannerList([]);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchBannerList();
  }, []);

  const handleBannerClick = (hotelId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?hotelId=${hotelId}`,
    }).catch(() => {
      Taro.redirectTo({
        url: `/pages/detail/index?hotelId=${hotelId}`,
      });
    });
  };

  const handleImageError = (imageUrl: string) => {
    console.warn(`Banner图片加载失败：${imageUrl}`);
  };

  const renderBannerList =
    bannerLoading || bannerLoadFailed || bannerList.length === 0
      ? [
          {
            id: "fallback_banner",
            image_url: fallbackBannerImage,
            hotel_id: "",
          },
        ]
      : bannerList;

  // 获取今天和明天的日期字符串（YYYY-MM-DD）
  const getDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [hotelName, setHotelName] = useState<string>("");

  const [checkInDate, setCheckInDate] = useState<string>(getDateString(today));
  const [checkOutDate, setCheckOutDate] = useState<string>(
    getDateString(tomorrow)
  );
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  // 星级状态：0=未选，1=1星及以上，2=2星及以上...5=5星
  const [selectedStarLevel, setSelectedStarLevel] = useState<number>(0);
  const starLevels = [1, 2, 3, 4, 5];

  // 快捷标签状态
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 筛选弹窗状态
  const [filterPopupVisible, setFilterPopupVisible] = useState<boolean>(false);

  // 顶部Tab状态
  const [activeTab, setActiveTab] = useState<string>("domestic");

  // Tab配置
  const tabs = [
    { id: "domestic", label: "国内" },
    { id: "overseas", label: "海外" },
    { id: "hourly", label: "钟点房", disabled: true },
    { id: "homestay", label: "民宿", disabled: true },
  ];

  // 处理Tab点击
  const handleTabClick = (tabId: string) => {
    if (tabs.find((t) => t.id === tabId)?.disabled) {
      Taro.showToast({
        title: "该功能暂未开放",
        icon: "none",
      });
      return;
    }
    setActiveTab(tabId);
  };

  const openCalendar = () => {
    setCalendarVisible(true);
  };

  const closeCalendar = () => {
    setCalendarVisible(false);
  };

  const confirmDate = (startDate: string, endDate: string) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
  };

  const formatDateShow = (date: string) => {
    if (!date) return "请选择";
    const [year, month, day] = date.split("-");
    return `${month}月${day}日`;
  };

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return "";
    const start = new Date(checkInDate).setHours(0, 0, 0, 0);
    const end = new Date(checkOutDate).setHours(0, 0, 0, 0);
    const nights = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return `共${nights}晚`;
  };

  // 处理快捷标签点击
  const handleTagClick = (tagId: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // 打开筛选弹窗
  const openFilterPopup = () => {
    setFilterPopupVisible(true);
  };

  // 关闭筛选弹窗
  const closeFilterPopup = () => {
    setFilterPopupVisible(false);
  };

  // 确认筛选条件
  const confirmFilter = (
    newMinPrice: number,
    newMaxPrice: number,
    newStarLevel: number
  ) => {
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setSelectedStarLevel(newStarLevel);
  };

  const handleSearch = () => {
    if (!province) {
      Taro.showToast({
        title: "请填写省份",
        icon: "none",
      });
      return;
    }
    if (!checkInDate || !checkOutDate) {
      Taro.showToast({
        title: "请选择入住和离店日期",
        icon: "none",
      });
      return;
    }

    const queryParams: Record<string, string> = {
      province,
      checkInDate,
      checkOutDate,
    };

    if (city) queryParams.city = city;
    if (hotelName) queryParams.keyword = hotelName;
    if (minPrice > 0) queryParams.minPrice = minPrice.toString();
    if (maxPrice < 1500) queryParams.maxPrice = maxPrice.toString();
    // 传递选中的星级等级（如3表示筛选3星及以上）
    if (selectedStarLevel > 0) {
      queryParams.starLevel = selectedStarLevel.toString();
    }
    // 传递选中的标签
    if (selectedTags.length > 0) {
      queryParams.tags = selectedTags.join(",");
    }

    const paramStr = new URLSearchParams(queryParams).toString();

    console.info("[weapp-index] search query params:", queryParams);

    Taro.setStorageSync("weapp_hotel_list_query", queryParams);

    Taro.navigateTo({
      url: `/pages/list/index?${paramStr}`,
    });
  };

  return (
    <View className="hotel-query-page">
      {/* ========== 原有UI保持不变 ========== */}
      <Swiper
        className="banner-container"
        indicatorDots
        autoplay={renderBannerList.length > 1}
        circular={renderBannerList.length > 1}
        interval={5000}
        duration={500}
      >
        {renderBannerList.map((item) => (
          <SwiperItem key={item.id} className="banner-item">
            <View
              className="banner-image-wrap"
              onClick={() => item.hotel_id && handleBannerClick(item.hotel_id)}
            >
              <Image
                className="banner-image"
                src={normalizeAssetUrl(item.image_url)}
                mode="aspectFill"
                lazyLoad
                onError={() => handleImageError(item.image_url)}
              />
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      <View className="top-tabs">
        {tabs.map((tab) => (
          <Text
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? "active" : ""} ${
              tab.disabled ? "disabled" : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </Text>
        ))}
      </View>

      <View className="query-form">
        {/* 地点选择行 */}
        <View className="form-row">
          <View className="form-item full-width">
            <Text className="label">地点</Text>
            <RegionPicker
              province={province}
              city={city}
              onChange={(newProvince, newCity) => {
                setProvince(newProvince);
                setCity(newCity);
              }}
            />
          </View>
        </View>

        {/* 酒店名称行 */}
        <View className="form-row">
          <View className="form-item full-width">
            <Text className="label">酒店名称</Text>
            <Input
              className="input"
              placeholder="选填：酒店名称/品牌"
              value={hotelName}
              onInput={(e) => setHotelName(e.detail.value)}
            />
          </View>
        </View>

        {/* 日期行 */}
        <View className="form-row date-row" onClick={openCalendar}>
          <View className="date-item">
            <Text className="date-label">入住</Text>
            <Text className="date-value">{formatDateShow(checkInDate)}</Text>
          </View>
          <Text className="date-sep">—</Text>
          <View className="date-item">
            <Text className="date-label">离店</Text>
            <Text className="date-value">{formatDateShow(checkOutDate)}</Text>
          </View>
          <Text className="date-nights">{getNights()}</Text>
        </View>

        {/* 价格/星级筛选行 */}
        <View className="form-row filter-trigger-row" onClick={openFilterPopup}>
          <View className="form-item full-width">
            <Text className="label">价格/星级</Text>
            <View className="filter-display">
              <Text className="filter-value">
                {minPrice > 0 || maxPrice < 1500
                  ? `¥${minPrice}-${maxPrice >= 1500 ? "1500+" : maxPrice}`
                  : "不限价格"}
                {selectedStarLevel > 0 ? ` · ${selectedStarLevel}星及以上` : ""}
              </Text>
              <Text className="filter-arrow">›</Text>
            </View>
          </View>
        </View>

        {/* 快捷标签 */}
        <View className="quick-tags-section">
          <View className="tags-container">
            {QUICK_TAGS.map((tag) => (
              <View
                key={tag.id}
                className={`tag-item ${
                  selectedTags.includes(tag.id) ? "active" : ""
                }`}
                onClick={() => handleTagClick(tag.id)}
              >
                <Text className="tag-label">{tag.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 查询按钮 */}
        <Button className="search-btn" onClick={handleSearch}>
          查询
        </Button>
      </View>

      <Calendar
        visible={calendarVisible}
        onClose={closeCalendar}
        onConfirm={confirmDate}
        defaultStartDate={checkInDate}
        defaultEndDate={checkOutDate}
      />

      <FilterPopup
        visible={filterPopupVisible}
        minPrice={minPrice}
        maxPrice={maxPrice}
        starLevel={selectedStarLevel}
        onClose={closeFilterPopup}
        onConfirm={confirmFilter}
      />
    </View>
  );
};

export default HotelQueryPage;

import {
  View,
  Image,
  Text,
  Button,
  Swiper,
  SwiperItem,
} from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useEffect, useMemo, useState } from "react";
import Calendar from "../../components/Calendar";
import { getHotelDetail } from "../../services";
import type { HotelDetail, RoomType } from "../../types/hotel";
import { normalizeAssetUrl } from "../../services/config";
import DetailHeader from "./components/DetailHeader";
import RoomCard from "./components/RoomCard";
import RatingDisplay from "./components/RatingDisplay";
import "./index.scss";

const HotelDetailPage = () => {
  const [hotelDetail, setHotelDetail] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const roomList = useMemo<RoomType[]>(() => {
    if (!hotelDetail?.rooms) return [];
    return [...hotelDetail.rooms].sort((a, b) => a.price - b.price);
  }, [hotelDetail]);

  const renderStar = (star: number) => {
    let starStr = "";
    for (let i = 0; i < star; i++) {
      starStr += "★";
    }
    for (let i = star; i < 5; i++) {
      starStr += "☆";
    }
    return starStr;
  };

  const formatDateShow = (date: string) => {
    if (!date) return "请选择";
    const [, month, day] = date.split("-");
    return `${month}月${day}日`;
  };

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return "--";
    const start = new Date(checkInDate).setHours(0, 0, 0, 0);
    const end = new Date(checkOutDate).setHours(0, 0, 0, 0);
    const nights = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return `${nights}`;
  };

  const openCalendar = () => setCalendarVisible(true);
  const closeCalendar = () => setCalendarVisible(false);

  const confirmDate = (startDate: string, endDate: string) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: 调用收藏API
    Taro.showToast({
      title: isFavorite ? "已取消收藏" : "已收藏",
      icon: "none",
    });
  };

  const handleBookRoom = (roomId: string) => {
    Taro.showToast({ title: "预订功能待开发", icon: "none" });
  };

  const router = useRouter();

  useEffect(() => {
    const params = (router.params || {}) as Record<string, string>;
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const pageOptions = (currentPage?.options || {}) as Record<string, string>;

    const hotelId =
      params.hotelId ||
      params.hotel_id ||
      params.id ||
      pageOptions.hotelId ||
      pageOptions.hotel_id ||
      pageOptions.id;

    if (!hotelId) {
      Taro.showToast({ title: "缺少酒店ID参数", icon: "none" });
      setLoading(false);
      return;
    }

    const fetchHotelDetail = async () => {
      setLoading(true);
      try {
        const data = await getHotelDetail(decodeURIComponent(hotelId));
        setHotelDetail(data);
      } catch (error) {
        Taro.showToast({ title: "酒店详情加载失败", icon: "none" });
        setHotelDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetail();
  }, [router.params]);

  if (loading) {
    return (
      <View className="loading-wrap">
        <Text className="loading-text">加载中...</Text>
      </View>
    );
  }

  if (!hotelDetail?.hotel) {
    return (
      <View className="loading-wrap">
        <Text className="loading-text">未找到该酒店</Text>
      </View>
    );
  }

  const imageUrls = Array.isArray(hotelDetail.hotel.images)
    ? hotelDetail.hotel.images.filter(
        (item) => typeof item === "string" && !!item
      )
    : [];

  const coverImages =
    imageUrls.length > 0
      ? imageUrls.map((img) => normalizeAssetUrl(img))
      : hotelDetail.hotel.cover_image
      ? [normalizeAssetUrl(hotelDetail.hotel.cover_image)]
      : ["https://picsum.photos/750/400?hotel-fallback"];

  return (
    <View className="hotel-detail-page">
      {/* 顶部导航栏 */}
      <DetailHeader
        hotelName={hotelDetail.hotel.name_cn}
        isFavorite={isFavorite}
        onBack={handleBack}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 图片轮播 */}
      <Swiper
        className="hotel-banner-swiper"
        indicatorDots
        autoplay={coverImages.length > 1}
        circular={coverImages.length > 1}
        interval={5000}
        duration={500}
      >
        {coverImages.map((img, idx) => (
          <SwiperItem key={`${img}-${idx}`}>
            <Image className="hotel-cover" src={img} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>

      <View className="hotel-base-info">
        <Text className="hotel-name-cn">{hotelDetail.hotel.name_cn}</Text>
        <Text className="hotel-name-en">{hotelDetail.hotel.name_en || ""}</Text>

        <View className="hotel-star-time">
          <Text className="hotel-star">
            {renderStar(hotelDetail.hotel.star)}
          </Text>
          <Text className="hotel-open-time">
            开业时间：{hotelDetail.hotel.open_time || "--"}
          </Text>
        </View>

        <Text className="hotel-address">📍 {hotelDetail.hotel.address}</Text>
      </View>

      <View className="stay-panel" onClick={openCalendar}>
        <View className="stay-item">
          <Text className="stay-label">入住</Text>
          <Text className="stay-value">{formatDateShow(checkInDate)}</Text>
        </View>
        <Text className="stay-sep">—</Text>
        <View className="stay-item">
          <Text className="stay-label">离店</Text>
          <Text className="stay-value">{formatDateShow(checkOutDate)}</Text>
        </View>
        <Text className="stay-nights">{`${getNights()}晚`}</Text>
      </View>

      {/* 评分/点评数 */}
      {(hotelDetail.hotel.rating !== undefined ||
        hotelDetail.hotel.review_count !== undefined) && (
        <RatingDisplay
          rating={hotelDetail.hotel.rating || 0}
          reviewCount={hotelDetail.hotel.review_count || 0}
        />
      )}

      {/* 房型列表 */}
      <View className="hotel-room-types">
        <Text className="room-types-title">房型列表</Text>
        {roomList.length === 0 ? (
          <View className="room-empty">暂无可售房型</View>
        ) : (
          <View className="room-list">
            {roomList.map((room) => (
              <RoomCard
                key={room.room_id}
                room={room}
                onBook={handleBookRoom}
              />
            ))}
          </View>
        )}
      </View>

      <View className="hotel-facilities">
        <Text className="facilities-title">酒店标签</Text>
        <View className="facilities-list">
          {(hotelDetail.hotel.tags || []).map((item, index) => (
            <View key={`${item}-${index}`} className="facility-item">
              {item}
            </View>
          ))}
        </View>
      </View>

      <View className="hotel-desc">
        <Text className="desc-title">酒店简介</Text>
        <Text className="desc-content">
          {hotelDetail.hotel.desc || "暂无简介"}
        </Text>
      </View>

      <View className="book-btn-wrap">
        <Button
          className="book-btn"
          onClick={() =>
            Taro.showToast({ title: "预订功能待开发", icon: "none" })
          }
        >
          立即预订
        </Button>
      </View>

      <Calendar
        visible={calendarVisible}
        onClose={closeCalendar}
        onConfirm={confirmDate}
        defaultStartDate={checkInDate}
        defaultEndDate={checkOutDate}
      />
    </View>
  );
};

export default HotelDetailPage;

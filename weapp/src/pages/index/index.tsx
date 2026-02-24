import { View, Image, Swiper, SwiperItem, Input, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import Calendar from '../../components/Calendar'
import './index.scss'

// 定义Banner数据类型
interface BannerItem {
  id: string
  imageUrl: string
  hotelId: string
}

const HotelQueryPage = () => {
  // ========== 原有逻辑保持不变 ==========
  const [bannerList] = useState<BannerItem[]>([
    {
      id: 'banner_1',
      imageUrl: 'https://picsum.photos/750/400?hotel1',
      hotelId: 'hotel_001'
    },
    {
      id: 'banner_2',
      imageUrl: 'https://picsum.photos/750/400?hotel2',
      hotelId: 'hotel_002'
    }
  ])

  const handleBannerClick = (hotelId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?hotelId=${hotelId}`
    }).catch(() => {
      Taro.redirectTo({
        url: `/pages/detail/index?hotelId=${hotelId}`
      })
    })
  }

  const handleImageError = (imageUrl: string) => {
    console.warn(`Banner图片加载失败：${imageUrl}`)
  }

  const [province, setProvince] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [hotelName, setHotelName] = useState<string>('')

  const [checkInDate, setCheckInDate] = useState<string>('')
  const [checkOutDate, setCheckOutDate] = useState<string>('')
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false)

  const [minPrice, setMinPrice] = useState<string>('')
  // 星级状态：0=未选，1=1星及以上，2=2星及以上...5=5星
  const [selectedStarLevel, setSelectedStarLevel] = useState<number>(0) 
  const starLevels = [1, 2, 3, 4, 5]

  const openCalendar = () => {
    setCalendarVisible(true)
  }

  const closeCalendar = () => {
    setCalendarVisible(false)
  }

  const confirmDate = (startDate: string, endDate: string) => {
    setCheckInDate(startDate)
    setCheckOutDate(endDate)
  }

  const formatDateShow = (date: string) => {
    if (!date) return '请选择'
    const [year, month, day] = date.split('-')
    return `${month}月${day}日`
  }

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return ''
    const start = new Date(checkInDate).setHours(0, 0, 0, 0)
    const end = new Date(checkOutDate).setHours(0, 0, 0, 0)
    const nights = Math.floor((end - start) / (1000 * 60 * 60 * 24))
    return `共${nights}晚`
  }

  const handleSearch = () => {
    if (!province) {
      Taro.showToast({
        title: '请填写省份',
        icon: 'none'
      })
      return
    }
    if (!checkInDate || !checkOutDate) {
      Taro.showToast({
        title: '请选择入住和离店日期',
        icon: 'none'
      })
      return
    }

    const queryParams: Record<string, string> = {
      province,
      city,
      hotelName,
      checkInDate,
      checkOutDate
    }

    if (minPrice) queryParams.minPrice = minPrice
    // 传递选中的星级等级（如3表示筛选3星及以上）
    if (selectedStarLevel > 0) queryParams.starLevel = selectedStarLevel.toString()

    const paramStr = new URLSearchParams(queryParams).toString()

    Taro.navigateTo({
      url: `/pages/list/index?${paramStr}`
    })
  }

  return (
    <View className="hotel-query-page">
      {/* ========== 原有UI保持不变 ========== */}
      <Swiper
        className="banner-container"
        indicatorDots
        autoplay
        circular
        interval={5000}
        duration={500}
      >
        {bannerList.map((item) => (
          <SwiperItem key={item.id} className="banner-item">
            <View
              className="banner-image-wrap"
              onClick={() => handleBannerClick(item.hotelId)}
            >
              <Image
                className="banner-image"
                src={item.imageUrl}
                mode="aspectFill"
                lazyLoad
                onError={() => handleImageError(item.imageUrl)}
              />
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      <View className="top-tabs">
        <Text className="tab-item active">国内</Text>
        <Text className="tab-item">海外</Text>
        <Text className="tab-item">钟点房</Text>
        <Text className="tab-item">民宿</Text>
      </View>

      <View className="query-form">
        {/* 省份+城市行 */}
        <View className="form-row">
          <View className="form-item half-width">
            <Text className="label">省份</Text>
            <Input
              className="input"
              placeholder="如：上海"
              value={province}
              onInput={(e) => setProvince(e.detail.value)}
            />
          </View>
          <View className="form-item half-width">
            <Text className="label">城市</Text>
            <Input
              className="input"
              placeholder="选填：具体城市"
              value={city}
              onInput={(e) => setCity(e.detail.value)}
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
            <Text className="date-value">
              {formatDateShow(checkInDate)}
            </Text>
          </View>
          <Text className="date-sep">—</Text>
          <View className="date-item">
            <Text className="date-label">离店</Text>
            <Text className="date-value">
              {formatDateShow(checkOutDate)}
            </Text>
          </View>
          <Text className="date-nights">
            {getNights()}
          </Text>
        </View>

        {/* 价格行 */}
        <View className="form-row">
          <View className="form-item full-width">
            <Text className="label">最低价格</Text>
            <Input
              className="input"
              placeholder="筛选大于等于该价格的酒店"
              value={minPrice}
              onInput={(e) => {
                const num = e.detail.value.replace(/\D/g, '')
                setMinPrice(num)
              }}
              type="number"
            />
            <Text className="price-unit">元/晚起</Text>
          </View>
        </View>

        {/* ========== 核心修改：星级选择器 ========== */}
        <View className="filter-row">
          <Text className="filter-title">酒店星级</Text>
          <View className="star-selector">
            {starLevels.map((level) => (
              <Text
                key={level}
                // 关键：判断当前星星是否 ≤ 选中的星级等级
                className={`star-icon ${level <= selectedStarLevel ? 'active' : ''}`}
                // 点击时设置为当前星级等级
                onClick={() => setSelectedStarLevel(level)}
              >
                ★
              </Text>
            ))}
            {/* 清除按钮 */}
            <Text
              className={`reset-star ${selectedStarLevel > 0 ? 'visible' : ''}`}
              onClick={() => setSelectedStarLevel(0)}
            >
              清除
            </Text>
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
    </View>
  )
}

export default HotelQueryPage
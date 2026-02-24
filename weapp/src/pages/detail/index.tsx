import { View, Image, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import './index.scss'

// 扩展酒店数据类型，包含所有必填维度
interface RoomType {
  name: string; // 房型名称（如大床房）
  price: number; // 房型价格（元/晚）
  desc: string; // 房型描述（如20㎡ | 1.8m床）
}

interface HotelInfo {
  id: string;
  nameCn: string; // 酒店中文名
  nameEn: string; // 酒店英文名
  star: number; // 酒店星级（1-5）
  address: string; // 酒店地址
  openTime: string; // 开业时间（格式：YYYY-MM）
  coverImage: string; // 封面图
  roomTypes: RoomType[]; // 房型列表
  facilities: string[]; // 设施
  desc: string; // 简介
}

const HotelDetailPage = () => {
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // 模拟酒店数据库（包含所有必填维度）
  const hotelDatabase: HotelInfo[] = [
    {
      id: 'hotel_001',
      nameCn: 'XX精品酒店（市中心店）',
      nameEn: 'XX Boutique Hotel (Downtown)',
      star: 4, // 四星级
      address: '北京市朝阳区建国路88号',
      openTime: '2020-08', // 开业时间
      coverImage: 'https://picsum.photos/750/400?hotel1',
      roomTypes: [
        { name: '舒适大床房', price: 299, desc: '20㎡ | 1.8m床 | 无早餐' },
        { name: '豪华双床房', price: 369, desc: '25㎡ | 1.2m*2床 | 含双早' },
        { name: '行政套房', price: 599, desc: '40㎡ | 1.8m床 + 客厅 | 含双早' }
      ],
      facilities: ['免费WiFi', '24小时热水', '停车场', '早餐'],
      desc: '紧邻地铁口，交通便利，房间宽敞明亮，配套设施齐全，是商务出行和旅游住宿的首选。'
    },
    {
      id: 'hotel_002',
      nameCn: 'XX度假酒店（景区店）',
      nameEn: 'XX Resort Hotel (Scenic Area)',
      star: 5, // 五星级
      address: '杭州市西湖区龙井路12号',
      openTime: '2018-12',
      coverImage: 'https://picsum.photos/750/400?hotel2',
      roomTypes: [
        { name: '湖景大床房', price: 459, desc: '30㎡ | 1.8m床 | 含双早' },
        { name: '亲子套房', price: 689, desc: '50㎡ | 1.8m+1.2m床 | 含3早' },
        { name: '温泉别墅', price: 1299, desc: '80㎡ | 独栋 | 私汤温泉 | 含4早' }
      ],
      facilities: ['湖景房', '温泉', '健身房', '接送服务'],
      desc: '直面西湖美景，推窗见景，度假风装修，配套温泉和健身设施，体验感拉满。'
    }
  ]

  // 格式化开业时间：YYYY-MM → YYYY年MM月
  const formatOpenTime = (time: string) => {
    const [year, month] = time.split('-')
    return `${year}年${month}月`
  }

  // 生成星级图标：4星 → ★★★★
  const renderStar = (star: number) => {
    let starStr = ''
    for (let i = 0; i < star; i++) {
      starStr += '★'
    }
    // 补充灰色空星（凑够5星展示）
    for (let i = star; i < 5; i++) {
      starStr += '☆'
    }
    return starStr
  }

  // 页面加载：获取参数 + 匹配数据
  useEffect(() => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = currentPage.options
    const hotelId = options.hotelId as string

    const targetHotel = hotelDatabase.find(item => item.id === hotelId)
    if (targetHotel) {
      setHotelInfo(targetHotel)
    } else {
      Taro.showToast({ title: '未找到该酒店', icon: 'none' })
      setTimeout(() => Taro.navigateBack(), 1500)
    }
    setLoading(false)
  }, [])

  // 加载中
  if (loading) {
    return (
      <View className="loading-wrap">
        <Text className="loading-text">加载中...</Text>
      </View>
    )
  }

  if (!hotelInfo) return null

  return (
    <View className="hotel-detail-page">
      {/* 封面图 */}
      <Image className="hotel-cover" src={hotelInfo.coverImage} mode="widthFix" />

      {/* 酒店基础信息（新增中英名、星级、开业时间） */}
      <View className="hotel-base-info">
        {/* 酒店名（中英） */}
        <Text className="hotel-name-cn">{hotelInfo.nameCn}</Text>
        <Text className="hotel-name-en">{hotelInfo.nameEn}</Text>
        
        {/* 星级 + 开业时间 */}
        <View className="hotel-star-time">
          <Text className="hotel-star">{renderStar(hotelInfo.star)}</Text>
          <Text className="hotel-open-time">开业时间：{formatOpenTime(hotelInfo.openTime)}</Text>
        </View>
        
        {/* 地址 */}
        <Text className="hotel-address">📍 {hotelInfo.address}</Text>
      </View>

      {/* 房型列表（核心新增维度） */}
      <View className="hotel-room-types">
        <Text className="room-types-title">房型列表</Text>
        <View className="room-list">
          {hotelInfo.roomTypes.map((room, index) => (
            <View key={index} className="room-item">
              <View className="room-left">
                <Text className="room-name">{room.name}</Text>
                <Text className="room-desc">{room.desc}</Text>
              </View>
              <View className="room-right">
                <Text className="room-price">¥{room.price}</Text>
                <Text className="room-unit">/晚</Text>
                <Button className="book-room-btn" size="mini">预订</Button>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 酒店设施（保留） */}
      <View className="hotel-facilities">
        <Text className="facilities-title">酒店设施</Text>
        <View className="facilities-list">
          {hotelInfo.facilities.map((item, index) => (
            <View key={index} className="facility-item">{item}</View>
          ))}
        </View>
      </View>

      {/* 酒店简介（保留） */}
      <View className="hotel-desc">
        <Text className="desc-title">酒店简介</Text>
        <Text className="desc-content">{hotelInfo.desc}</Text>
      </View>

      {/* 底部预订按钮（保留） */}
      <View className="book-btn-wrap">
        <Button className="book-btn" onClick={() => Taro.showToast({ title: '预订功能待开发' })}>
          立即预订
        </Button>
      </View>
    </View>
  )
}

export default HotelDetailPage
import { View, Text, Picker } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";
import "./index.scss";

// 简化的省份-城市数据
const REGION_DATA = [
  {
    label: "北京",
    value: "北京",
    children: [
      { label: "东城区", value: "东城区" },
      { label: "西城区", value: "西城区" },
      { label: "朝阳区", value: "朝阳区" },
      { label: "丰台区", value: "丰台区" },
      { label: "石景山区", value: "石景山区" },
      { label: "海淀区", value: "海淀区" },
      { label: "门头沟区", value: "门头沟区" },
      { label: "房山区", value: "房山区" },
      { label: "通州区", value: "通州区" },
      { label: "顺义区", value: "顺义区" },
      { label: "昌平区", value: "昌平区" },
      { label: "大兴区", value: "大兴区" },
      { label: "怀柔区", value: "怀柔区" },
      { label: "平谷区", value: "平谷区" },
      { label: "密云区", value: "密云区" },
      { label: "延庆区", value: "延庆区" },
    ],
  },
  {
    label: "上海",
    value: "上海",
    children: [
      { label: "黄浦区", value: "黄浦区" },
      { label: "徐汇区", value: "徐汇区" },
      { label: "长宁区", value: "长宁区" },
      { label: "静安区", value: "静安区" },
      { label: "普陀区", value: "普陀区" },
      { label: "虹口区", value: "虹口区" },
      { label: "杨浦区", value: "杨浦区" },
      { label: "闵行区", value: "闵行区" },
      { label: "宝山区", value: "宝山区" },
      { label: "嘉定区", value: "嘉定区" },
      { label: "浦东新区", value: "浦东新区" },
      { label: "金山区", value: "金山区" },
      { label: "松江区", value: "松江区" },
      { label: "青浦区", value: "青浦区" },
      { label: "奉贤区", value: "奉贤区" },
      { label: "崇明区", value: "崇明区" },
    ],
  },
  {
    label: "广东",
    value: "广东",
    children: [
      { label: "广州市", value: "广州市" },
      { label: "深圳市", value: "深圳市" },
      { label: "珠海市", value: "珠海市" },
      { label: "汕头市", value: "汕头市" },
      { label: "佛山市", value: "佛山市" },
      { label: "韶关市", value: "韶关市" },
      { label: "湛江市", value: "湛江市" },
      { label: "肇庆市", value: "肇庆市" },
      { label: "江门市", value: "江门市" },
      { label: "茂名市", value: "茂名市" },
      { label: "惠州市", value: "惠州市" },
      { label: "梅州市", value: "梅州市" },
      { label: "汕尾市", value: "汕尾市" },
      { label: "河源市", value: "河源市" },
      { label: "阳江市", value: "阳江市" },
      { label: "清远市", value: "清远市" },
      { label: "东莞市", value: "东莞市" },
      { label: "中山市", value: "中山市" },
      { label: "潮州市", value: "潮州市" },
      { label: "揭阳市", value: "揭阳市" },
      { label: "云浮市", value: "云浮市" },
    ],
  },
  {
    label: "浙江",
    value: "浙江",
    children: [
      { label: "杭州市", value: "杭州市" },
      { label: "宁波市", value: "宁波市" },
      { label: "温州市", value: "温州市" },
      { label: "嘉兴市", value: "嘉兴市" },
      { label: "湖州市", value: "湖州市" },
      { label: "绍兴市", value: "绍兴市" },
      { label: "金华市", value: "金华市" },
      { label: "衢州市", value: "衢州市" },
      { label: "舟山市", value: "舟山市" },
      { label: "台州市", value: "台州市" },
      { label: "丽水市", value: "丽水市" },
    ],
  },
  {
    label: "江苏",
    value: "江苏",
    children: [
      { label: "南京市", value: "南京市" },
      { label: "无锡市", value: "无锡市" },
      { label: "徐州市", value: "徐州市" },
      { label: "常州市", value: "常州市" },
      { label: "苏州市", value: "苏州市" },
      { label: "南通市", value: "南通市" },
      { label: "连云港市", value: "连云港市" },
      { label: "淮安市", value: "淮安市" },
      { label: "盐城市", value: "盐城市" },
      { label: "扬州市", value: "扬州市" },
      { label: "镇江市", value: "镇江市" },
      { label: "泰州市", value: "泰州市" },
      { label: "宿迁市", value: "宿迁市" },
    ],
  },
  {
    label: "四川",
    value: "四川",
    children: [
      { label: "成都市", value: "成都市" },
      { label: "自贡市", value: "自贡市" },
      { label: "攀枝花市", value: "攀枝花市" },
      { label: "泸州市", value: "泸州市" },
      { label: "德阳市", value: "德阳市" },
      { label: "绵阳市", value: "绵阳市" },
      { label: "广元市", value: "广元市" },
      { label: "遂宁市", value: "遂宁市" },
      { label: "内江市", value: "内江市" },
      { label: "乐山市", value: "乐山市" },
      { label: "南充市", value: "南充市" },
      { label: "眉山市", value: "眉山市" },
      { label: "宜宾市", value: "宜宾市" },
      { label: "广安市", value: "广安市" },
      { label: "达州市", value: "达州市" },
      { label: "雅安市", value: "雅安市" },
      { label: "巴中市", value: "巴中市" },
      { label: "资阳市", value: "资阳市" },
    ],
  },
  {
    label: "湖北",
    value: "湖北",
    children: [
      { label: "武汉市", value: "武汉市" },
      { label: "黄石市", value: "黄石市" },
      { label: "十堰市", value: "十堰市" },
      { label: "宜昌市", value: "宜昌市" },
      { label: "襄阳市", value: "襄阳市" },
      { label: "鄂州市", value: "鄂州市" },
      { label: "荆门市", value: "荆门市" },
      { label: "孝感市", value: "孝感市" },
      { label: "荆州市", value: "荆州市" },
      { label: "黄冈市", value: "黄冈市" },
      { label: "咸宁市", value: "咸宁市" },
      { label: "随州市", value: "随州市" },
    ],
  },
  {
    label: "湖南",
    value: "湖南",
    children: [
      { label: "长沙市", value: "长沙市" },
      { label: "株洲市", value: "株洲市" },
      { label: "湘潭市", value: "湘潭市" },
      { label: "衡阳市", value: "衡阳市" },
      { label: "邵阳市", value: "邵阳市" },
      { label: "岳阳市", value: "岳阳市" },
      { label: "常德市", value: "常德市" },
      { label: "张家界市", value: "张家界市" },
      { label: "益阳市", value: "益阳市" },
      { label: "郴州市", value: "郴州市" },
      { label: "永州市", value: "永州市" },
      { label: "怀化市", value: "怀化市" },
      { label: "娄底市", value: "娄底市" },
    ],
  },
  {
    label: "福建",
    value: "福建",
    children: [
      { label: "福州市", value: "福州市" },
      { label: "厦门市", value: "厦门市" },
      { label: "莆田市", value: "莆田市" },
      { label: "三明市", value: "三明市" },
      { label: "泉州市", value: "泉州市" },
      { label: "漳州市", value: "漳州市" },
      { label: "南平市", value: "南平市" },
      { label: "龙岩市", value: "龙岩市" },
      { label: "宁德市", value: "宁德市" },
    ],
  },
  {
    label: "山东",
    value: "山东",
    children: [
      { label: "济南市", value: "济南市" },
      { label: "青岛市", value: "青岛市" },
      { label: "淄博市", value: "淄博市" },
      { label: "枣庄市", value: "枣庄市" },
      { label: "东营市", value: "东营市" },
      { label: "烟台市", value: "烟台市" },
      { label: "潍坊市", value: "潍坊市" },
      { label: "济宁市", value: "济宁市" },
      { label: "泰安市", value: "泰安市" },
      { label: "威海市", value: "威海市" },
      { label: "日照市", value: "日照市" },
      { label: "临沂市", value: "临沂市" },
      { label: "德州市", value: "德州市" },
      { label: "聊城市", value: "聊城市" },
      { label: "滨州市", value: "滨州市" },
      { label: "菏泽市", value: "菏泽市" },
    ],
  },
];

interface RegionPickerProps {
  province: string;
  city: string;
  onChange: (province: string, city: string) => void;
}

const RegionPicker: React.FC<RegionPickerProps> = ({
  province,
  city,
  onChange,
}) => {
  const [locating, setLocating] = useState<boolean>(false);

  // 处理定位点击
  const handleLocationClick = async () => {
    setLocating(true);
    try {
      // 1. 获取用户授权
      const authResult = await Taro.getSetting();
      if (!authResult.authSetting["scope.userLocation"]) {
        const authRes = await Taro.authorize({
          scope: "scope.userLocation",
        });
        if (!authRes) {
          Taro.showToast({
            title: "需要定位权限",
            icon: "none",
          });
          setLocating(false);
          return;
        }
      }

      // 2. 获取当前位置
      const locationRes = await Taro.getLocation({
        type: "gcj02",
      });

      // 3. 逆地理编码（需要调用地图API，这里使用模拟数据）
      // 实际项目中需要调用腾讯地图/高德地图的逆地理编码API
      // 示例：https://apis.map.qq.com/ws/geocoder/v1/?location=lat,lng&key=YOUR_KEY

      // 模拟定位结果（实际项目中替换为真实API调用）
      // 这里假设定位到北京市朝阳区
      const mockLocationResult = {
        province: "北京",
        city: "朝阳区",
      };

      // 检查省份是否在数据中
      const provinceData = REGION_DATA.find(
        (p) => p.value === mockLocationResult.province
      );
      if (provinceData) {
        const cityData = provinceData.children.find(
          (c) => c.value === mockLocationResult.city
        );
        if (cityData) {
          onChange(mockLocationResult.province, mockLocationResult.city);
          Taro.showToast({
            title: `已定位到${mockLocationResult.province}${mockLocationResult.city}`,
            icon: "success",
          });
        } else {
          // 如果城市不在列表中，只设置省份
          onChange(mockLocationResult.province, "");
          Taro.showToast({
            title: `已定位到${mockLocationResult.province}`,
            icon: "success",
          });
        }
      } else {
        Taro.showToast({
          title: "当前地区暂不支持",
          icon: "none",
        });
      }
    } catch (error) {
      console.error("定位失败:", error);
      Taro.showToast({
        title: "定位失败，请手动选择",
        icon: "none",
      });
    } finally {
      setLocating(false);
    }
  };

  // 查找省份索引
  const getProvinceIndex = () => {
    const index = REGION_DATA.findIndex((p) => p.value === province);
    return index >= 0 ? index : 0;
  };

  // 查找城市索引
  const getCityIndex = () => {
    const provinceData = REGION_DATA.find((p) => p.value === province);
    if (!provinceData) return 0;
    const index = provinceData.children.findIndex((c) => c.value === city);
    return index >= 0 ? index : 0;
  };

  // 处理省份选择变化
  const handleProvinceChange = (e: any) => {
    const index = e.detail.value;
    const selectedProvince = REGION_DATA[index];
    // 选择省份时，重置城市为第一个
    onChange(selectedProvince.value, selectedProvince.children[0]?.value || "");
  };

  // 处理城市选择变化
  const handleCityChange = (e: any) => {
    const index = e.detail.value;
    const provinceData = REGION_DATA.find((p) => p.value === province);
    if (provinceData) {
      const selectedCity = provinceData.children[index];
      onChange(province, selectedCity.value);
    }
  };

  // 获取显示文本
  const getDisplayText = () => {
    if (!province) return "请选择省份/城市";
    if (!city) return province;
    return `${province} ${city}`;
  };

  // 获取当前省份的城市列表
  const getCurrentCities = () => {
    const provinceData = REGION_DATA.find((p) => p.value === province);
    return provinceData?.children.map((c) => c.label) || [];
  };

  return (
    <View className="region-picker-wrapper">
      <View className="region-picker-content">
        <Picker
          mode="selector"
          range={REGION_DATA.map((p) => p.label)}
          value={getProvinceIndex()}
          onChange={handleProvinceChange}
        >
          <View className="picker-item">
            <Text className={`picker-text ${province ? "has-value" : ""}`}>
              {province || "省份"}
            </Text>
            <Text className="picker-arrow">›</Text>
          </View>
        </Picker>
        <Picker
          mode="selector"
          range={getCurrentCities()}
          value={getCityIndex()}
          onChange={handleCityChange}
          disabled={!province}
        >
          <View className={`picker-item ${!province ? "disabled" : ""}`}>
            <Text className={`picker-text ${city ? "has-value" : ""}`}>
              {city || "城市"}
            </Text>
            <Text className="picker-arrow">›</Text>
          </View>
        </Picker>
      </View>
      <View
        className={`location-icon ${locating ? "locating" : ""}`}
        onClick={handleLocationClick}
      >
        <Text className="icon-text">{locating ? "..." : "📍"}</Text>
      </View>
    </View>
  );
};

export default RegionPicker;

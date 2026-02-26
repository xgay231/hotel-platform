import { View, Text } from "@tarojs/components";
import Taro, { useReachBottom, useRouter } from "@tarojs/taro";
import { useEffect, useMemo, useRef, useState } from "react";
import { getHotelList } from "../../services";
import type { HotelListItem, HotelListQuery } from "../../types/hotel";
import ListHeader from "./components/ListHeader";
import FilterBar from "./components/FilterBar";
import SortDropdown from "./components/SortDropdown";
import LocationFilter from "./components/LocationFilter";
import DetailFilter from "./components/DetailFilter";
import FilterPopup from "../../components/FilterPopup";
import HotelCard from "./components/HotelCard";
import "./index.scss";

const PAGE_SIZE = 10;

const HotelListPage = () => {
  const [list, setList] = useState<HotelListItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const fetchingRef = useRef(false);

  const router = useRouter();

  // 筛选状态
  const [sortBy, setSortBy] = useState<
    "" | "priceAsc" | "priceDesc" | "ratingDesc"
  >("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [starLevel, setStarLevel] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 位置状态（独立管理，用于LocationFilter组件）
  const [currentProvince, setCurrentProvince] = useState<string>("");
  const [currentCity, setCurrentCity] = useState<string>("");

  // UI状态
  const [sortDropdownVisible, setSortDropdownVisible] =
    useState<boolean>(false);
  const [locationFilterVisible, setLocationFilterVisible] =
    useState<boolean>(false);
  const [filterPopupVisible, setFilterPopupVisible] = useState<boolean>(false);
  const [detailFilterVisible, setDetailFilterVisible] =
    useState<boolean>(false);

  // 搜索关键词
  const [keyword, setKeyword] = useState<string>("");

  // 解析路由参数
  const decodeQueryValue = (value?: string): string => {
    if (!value) return "";
    try {
      return decodeURIComponent(value);
    } catch (_error) {
      return value;
    }
  };

  const normalizeQueryParams = (
    params: Record<string, string>
  ): Record<string, string> => {
    const next: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      next[key] = decodeQueryValue(value);
    });
    return next;
  };

  const routerParams = useMemo(() => {
    const fromHook = (router.params || {}) as Record<string, string>;
    if (Object.keys(fromHook).length > 0) {
      const normalized = normalizeQueryParams(fromHook);
      console.info("[weapp-list] params source: useRouter", normalized);
      return normalized;
    }

    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const fromPage = (currentPage?.options || {}) as Record<string, string>;
    if (Object.keys(fromPage).length > 0) {
      const normalized = normalizeQueryParams(fromPage);
      console.info(
        "[weapp-list] params source: currentPage.options",
        normalized
      );
      return normalized;
    }

    const fromStorage = (Taro.getStorageSync("weapp_hotel_list_query") ||
      {}) as Record<string, string>;
    const normalized = normalizeQueryParams(fromStorage);
    console.info("[weapp-list] params source: storage", normalized);
    return normalized;
  }, [router.params]);

  // 基础查询参数（优先使用当前选择的位置）
  const baseQuery = useMemo<HotelListQuery>(
    () => ({
      province: currentProvince || routerParams.province || undefined,
      city: currentCity || routerParams.city || undefined,
      keyword: routerParams.keyword || undefined,
      checkInDate: routerParams.checkInDate || undefined,
      checkOutDate: routerParams.checkOutDate || undefined,
    }),
    [routerParams, currentProvince, currentCity]
  );

  // 组合查询参数
  const composedQuery = useMemo<HotelListQuery>(() => {
    const nextQuery = {
      ...baseQuery,
      sortBy: sortBy === "" ? undefined : sortBy,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 1500 ? maxPrice : undefined,
      starLevel: starLevel > 0 ? starLevel : undefined,
      tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
      keyword: keyword || baseQuery.keyword,
    };

    console.info("[weapp-list] composed query:", nextQuery);
    return nextQuery;
  }, [baseQuery, sortBy, minPrice, maxPrice, starLevel, selectedTags, keyword]);

  // 获取酒店列表
  const fetchList = async (nextPage: number, reset = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    if (reset) {
      setInitialLoading(true);
      setError("");
    } else {
      setLoadingMore(true);
    }

    try {
      const requestQuery = {
        ...composedQuery,
        page: nextPage,
        pageSize: PAGE_SIZE,
      };
      console.info("[weapp-list] request query:", requestQuery);

      const res = await getHotelList(requestQuery);
      console.info("[weapp-list] response count:", res.list?.length || 0);

      const nextList = res.list || [];
      setList((prev) => (reset ? nextList : [...prev, ...nextList]));
      setPage(res.page || nextPage);
      setHasMore(Boolean(res.hasMore));
    } catch (e) {
      console.error("[weapp-list] fetch error:", e);
      if (reset) {
        setError("加载失败，请稍后重试");
        setList([]);
      }
    } finally {
      if (reset) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }
      fetchingRef.current = false;
    }
  };

  // 初始化筛选状态
  useEffect(() => {
    const nextSortBy = routerParams.sortBy as
      | ""
      | "priceAsc"
      | "priceDesc"
      | "ratingDesc";
    const nextStarLevel = Number(routerParams.starLevel || 0);
    const nextMinPrice = Number(routerParams.minPrice || 0);
    const nextMaxPrice = Number(routerParams.maxPrice || 1500);
    const nextTags = routerParams.tags
      ? routerParams.tags.split(",").filter(Boolean)
      : [];
    const nextKeyword = routerParams.keyword || "";
    const nextProvince = routerParams.province || "";
    const nextCity = routerParams.city || "";

    console.info("[weapp-list] init state from params:", {
      routerParams,
      nextSortBy,
      nextStarLevel,
      nextMinPrice,
      nextMaxPrice,
      nextTags,
      nextKeyword,
      nextProvince,
      nextCity,
    });

    setSortBy(nextSortBy || "");
    setStarLevel(nextStarLevel);
    setMinPrice(nextMinPrice);
    setMaxPrice(nextMaxPrice);
    setSelectedTags(nextTags);
    setKeyword(nextKeyword);
    setCurrentProvince(nextProvince);
    setCurrentCity(nextCity);
  }, [routerParams]);

  // 查询参数变化时重新获取列表
  useEffect(() => {
    fetchList(1, true);
  }, [composedQuery]);

  // 上滑加载更多
  useReachBottom(() => {
    if (initialLoading || loadingMore || !hasMore) return;
    console.info("[weapp-list] reach bottom, fetch next page:", page + 1);
    fetchList(page + 1);
  });

  // 跳转详情页
  const goDetail = (hotelId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?hotelId=${hotelId}`,
    });
  };

  // 处理搜索
  const handleSearch = () => {
    setPage(1);
    setList([]);
    fetchList(1, true);
  };

  // 处理排序变化
  const handleSortChange = (
    value: "" | "priceAsc" | "priceDesc" | "ratingDesc"
  ) => {
    setSortBy(value);
  };

  // 处理位置变化
  const handleLocationChange = (province?: string, city?: string) => {
    setCurrentProvince(province || "");
    setCurrentCity(city || "");
  };

  // 处理价格星级变化
  const handlePriceStarChange = (
    newMinPrice: number,
    newMaxPrice: number,
    newStarLevel: number
  ) => {
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setStarLevel(newStarLevel);
  };

  // 处理标签变化
  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  // 加载状态
  if (initialLoading) {
    return (
      <View className="hotel-list-page">
        <View className="status-wrap">
          <Text className="status-text">加载中...</Text>
        </View>
      </View>
    );
  }

  // 错误状态
  if (error) {
    return (
      <View className="hotel-list-page">
        <View className="status-wrap">
          <Text className="status-text">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="hotel-list-page">
      {/* 顶部导航栏 */}
      <ListHeader
        province={baseQuery.province}
        city={baseQuery.city}
        checkInDate={baseQuery.checkInDate}
        checkOutDate={baseQuery.checkOutDate}
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
      />

      {/* 筛选条件栏 */}
      <FilterBar
        sortBy={sortBy}
        province={baseQuery.province}
        city={baseQuery.city}
        minPrice={minPrice}
        maxPrice={maxPrice}
        starLevel={starLevel}
        selectedTags={selectedTags}
        onSortClick={() => setSortDropdownVisible(true)}
        onLocationClick={() => setLocationFilterVisible(true)}
        onPriceStarClick={() => setFilterPopupVisible(true)}
        onDetailClick={() => setDetailFilterVisible(true)}
      />

      {/* 酒店列表 */}
      {list.length === 0 ? (
        <View className="status-wrap">
          <Text className="status-text">暂无符合条件的酒店</Text>
        </View>
      ) : (
        <View className="list-wrap">
          {list.map((hotel) => (
            <HotelCard
              key={hotel.hotel_id}
              hotel={hotel}
              onClick={() => goDetail(hotel.hotel_id)}
            />
          ))}
        </View>
      )}

      {/* 加载状态 */}
      <View className="page-status">
        <Text className="page-status-text">
          {loadingMore
            ? "加载更多中..."
            : hasMore
            ? "上滑加载更多"
            : "已经到底了"}
        </Text>
      </View>

      {/* 排序下拉组件 */}
      <SortDropdown
        visible={sortDropdownVisible}
        value={sortBy}
        onChange={handleSortChange}
        onClose={() => setSortDropdownVisible(false)}
      />

      {/* 位置筛选组件 */}
      <LocationFilter
        visible={locationFilterVisible}
        province={currentProvince || baseQuery.province}
        city={currentCity || baseQuery.city}
        onChange={handleLocationChange}
        onClose={() => setLocationFilterVisible(false)}
      />

      {/* 价格/星级筛选弹窗 */}
      <FilterPopup
        visible={filterPopupVisible}
        minPrice={minPrice}
        maxPrice={maxPrice}
        starLevel={starLevel}
        onClose={() => setFilterPopupVisible(false)}
        onConfirm={handlePriceStarChange}
      />

      {/* 详细筛选组件 */}
      <DetailFilter
        visible={detailFilterVisible}
        selectedTags={selectedTags}
        onChange={handleTagsChange}
        onClose={() => setDetailFilterVisible(false)}
      />
    </View>
  );
};

export default HotelListPage;

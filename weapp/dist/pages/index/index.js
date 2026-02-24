"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/index/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "webpack/container/remote/@tarojs/taro");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/container/remote/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_Calendar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/Calendar */ "./src/components/Calendar/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "webpack/container/remote/react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* provided dependency */ var URLSearchParams = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime")["URLSearchParams"];






// 定义Banner数据类型

const HotelQueryPage = () => {
  // ========== 原有逻辑保持不变 ==========
  const [bannerList] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([{
    id: 'banner_1',
    imageUrl: 'https://picsum.photos/750/400?hotel1',
    hotelId: 'hotel_001'
  }, {
    id: 'banner_2',
    imageUrl: 'https://picsum.photos/750/400?hotel2',
    hotelId: 'hotel_002'
  }]);
  const handleBannerClick = hotelId => {
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().navigateTo({
      url: `/pages/detail/index?hotelId=${hotelId}`
    }).catch(() => {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().redirectTo({
        url: `/pages/detail/index?hotelId=${hotelId}`
      });
    });
  };
  const handleImageError = imageUrl => {
    console.warn(`Banner图片加载失败：${imageUrl}`);
  };
  const [province, setProvince] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [city, setCity] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [hotelName, setHotelName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [checkInDate, setCheckInDate] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [checkOutDate, setCheckOutDate] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [calendarVisible, setCalendarVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [minPrice, setMinPrice] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  // 星级状态：0=未选，1=1星及以上，2=2星及以上...5=5星
  const [selectedStarLevel, setSelectedStarLevel] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  const starLevels = [1, 2, 3, 4, 5];
  const openCalendar = () => {
    setCalendarVisible(true);
  };
  const closeCalendar = () => {
    setCalendarVisible(false);
  };
  const confirmDate = (startDate, endDate) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
  };
  const formatDateShow = date => {
    if (!date) return '请选择';
    const [year, month, day] = date.split('-');
    return `${month}月${day}日`;
  };
  const getNights = () => {
    if (!checkInDate || !checkOutDate) return '';
    const start = new Date(checkInDate).setHours(0, 0, 0, 0);
    const end = new Date(checkOutDate).setHours(0, 0, 0, 0);
    const nights = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return `共${nights}晚`;
  };
  const handleSearch = () => {
    if (!province) {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
        title: '请填写省份',
        icon: 'none'
      });
      return;
    }
    if (!checkInDate || !checkOutDate) {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
        title: '请选择入住和离店日期',
        icon: 'none'
      });
      return;
    }
    const queryParams = {
      province,
      city,
      hotelName,
      checkInDate,
      checkOutDate
    };
    if (minPrice) queryParams.minPrice = minPrice;
    // 传递选中的星级等级（如3表示筛选3星及以上）
    if (selectedStarLevel > 0) queryParams.starLevel = selectedStarLevel.toString();
    const paramStr = new URLSearchParams(queryParams).toString();
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().navigateTo({
      url: `/pages/list/index?${paramStr}`
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
    className: "hotel-query-page",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Swiper, {
      className: "banner-container",
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 5000,
      duration: 500,
      children: bannerList.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.SwiperItem, {
        className: "banner-item",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
          className: "banner-image-wrap",
          onClick: () => handleBannerClick(item.hotelId),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Image, {
            className: "banner-image",
            src: item.imageUrl,
            mode: "aspectFill",
            lazyLoad: true,
            onError: () => handleImageError(item.imageUrl)
          })
        })
      }, item.id))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
      className: "top-tabs",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
        className: "tab-item active",
        children: "\u56FD\u5185"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
        className: "tab-item",
        children: "\u6D77\u5916"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
        className: "tab-item",
        children: "\u949F\u70B9\u623F"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
        className: "tab-item",
        children: "\u6C11\u5BBF"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
      className: "query-form",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
        className: "form-row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
          className: "form-item half-width",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "label",
            children: "\u7701\u4EFD"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Input, {
            className: "input",
            placeholder: "\u5982\uFF1A\u4E0A\u6D77",
            value: province,
            onInput: e => setProvince(e.detail.value)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
          className: "form-item half-width",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "label",
            children: "\u57CE\u5E02"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Input, {
            className: "input",
            placeholder: "\u9009\u586B\uFF1A\u5177\u4F53\u57CE\u5E02",
            value: city,
            onInput: e => setCity(e.detail.value)
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
        className: "form-row",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
          className: "form-item full-width",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "label",
            children: "\u9152\u5E97\u540D\u79F0"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Input, {
            className: "input",
            placeholder: "\u9009\u586B\uFF1A\u9152\u5E97\u540D\u79F0/\u54C1\u724C",
            value: hotelName,
            onInput: e => setHotelName(e.detail.value)
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
        className: "form-row date-row",
        onClick: openCalendar,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
          className: "date-item",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "date-label",
            children: "\u5165\u4F4F"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "date-value",
            children: formatDateShow(checkInDate)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
          className: "date-sep",
          children: "\u2014"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
          className: "date-item",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "date-label",
            children: "\u79BB\u5E97"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "date-value",
            children: formatDateShow(checkOutDate)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
          className: "date-nights",
          children: getNights()
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
        className: "form-row",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
          className: "form-item full-width",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "label",
            children: "\u6700\u4F4E\u4EF7\u683C"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Input, {
            className: "input",
            placeholder: "\u7B5B\u9009\u5927\u4E8E\u7B49\u4E8E\u8BE5\u4EF7\u683C\u7684\u9152\u5E97",
            value: minPrice,
            onInput: e => {
              const num = e.detail.value.replace(/\D/g, '');
              setMinPrice(num);
            },
            type: "number"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: "price-unit",
            children: "\u5143/\u665A\u8D77"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
        className: "filter-row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
          className: "filter-title",
          children: "\u9152\u5E97\u661F\u7EA7"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.View, {
          className: "star-selector",
          children: [starLevels.map(level => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            // 关键：判断当前星星是否 ≤ 选中的星级等级
            className: `star-icon ${level <= selectedStarLevel ? 'active' : ''}`
            // 点击时设置为当前星级等级
            ,
            onClick: () => setSelectedStarLevel(level),
            children: "\u2605"
          }, level)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Text, {
            className: `reset-star ${selectedStarLevel > 0 ? 'visible' : ''}`,
            onClick: () => setSelectedStarLevel(0),
            children: "\u6E05\u9664"
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
        className: "search-btn",
        onClick: handleSearch,
        children: "\u67E5\u8BE2"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_Calendar__WEBPACK_IMPORTED_MODULE_2__["default"], {
      visible: calendarVisible,
      onClose: closeCalendar,
      onConfirm: confirmDate,
      defaultStartDate: checkInDate,
      defaultEndDate: checkOutDate
    })]
  });
};
/* harmony default export */ __webpack_exports__["default"] = (HotelQueryPage);

/***/ }),

/***/ "./src/components/Calendar/index.tsx":
/*!*******************************************!*\
  !*** ./src/components/Calendar/index.tsx ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/container/remote/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "webpack/container/remote/react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);




// 定义日期类型

// 组件属性

// 工具函数：格式化日期为 YYYY-MM-DD（彻底解决时区问题）
const formatDate = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const Calendar = ({
  visible,
  onClose,
  onConfirm,
  defaultStartDate,
  defaultEndDate
}) => {
  // 当前年月
  const [currentYear, setCurrentYear] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Date().getMonth() + 1);
  // 选中的日期（核心：用useState确保状态更新触发重渲染）
  const [startDate, setStartDate] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultStartDate || '');
  const [endDate, setEndDate] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultEndDate || '');
  // 日历数据
  const [calendarData, setCalendarData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);

  // 核心：生成日历数据（抽成独立函数，确保可重复调用）
  const generateCalendar = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((year, month) => {
    const result = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const firstDayWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = formatDate(new Date());

    // 补上个月的尾巴
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    for (let i = firstDayWeek - 1; i > 0; i--) {
      const day = prevMonthLastDay - i + 1;
      const date = formatDate(new Date(year, month - 2, day));
      result.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: date === today,
        isSelected: false,
        isInRange: false,
        isStart: false,
        isEnd: false
      });
    }

    // 当月的日期（核心：每次生成都重新计算选中状态）
    for (let i = 1; i <= daysInMonth; i++) {
      const date = formatDate(new Date(year, month - 1, i));
      // 实时判断选中状态（关键：用最新的startDate/endDate）
      const isStart = date === startDate;
      const isEnd = date === endDate;
      const isSelected = isStart || isEnd;

      // 区间判断
      let isInRange = false;
      if (startDate && endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const current = new Date(date).getTime();
        isInRange = current > start && current < end;
      }
      result.push({
        day: i,
        date,
        isCurrentMonth: true,
        isToday: date === today,
        isSelected,
        isInRange,
        isStart,
        isEnd
      });
    }

    // 补下个月的开头
    const totalCells = 42;
    const needPad = totalCells - result.length;
    for (let i = 1; i <= needPad; i++) {
      const date = formatDate(new Date(year, month, i));
      result.push({
        day: i,
        date,
        isCurrentMonth: false,
        isToday: date === today,
        isSelected: false,
        isInRange: false,
        isStart: false,
        isEnd: false
      });
    }
    setCalendarData(result);
  }, [startDate, endDate]); // 依赖：startDate/endDate变化就重新生成

  // 初始化+年月变化+选中日期变化 都重新生成日历
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    generateCalendar(currentYear, currentMonth);
  }, [currentYear, currentMonth, generateCalendar]);

  // 切换月份
  const changeMonth = type => {
    if (type === 'prev') {
      currentMonth === 1 ? (setCurrentYear(currentYear - 1), setCurrentMonth(12)) : setCurrentMonth(currentMonth - 1);
    } else {
      currentMonth === 12 ? (setCurrentYear(currentYear + 1), setCurrentMonth(1)) : setCurrentMonth(currentMonth + 1);
    }
  };

  // 核心修复：选择日期（即时更新状态+重新生成日历）
  const selectDate = date => {
    // 过滤非当月/过去的日期
    const targetItem = calendarData.find(item => item.date === date);
    if (!targetItem?.isCurrentMonth) return;
    const today = formatDate(new Date());
    if (date < today) return;

    // 选择逻辑（即时更新状态）
    if (!startDate) {
      // 第一次选择：设置入住日期
      setStartDate(date);
    } else if (!endDate) {
      // 第二次选择：设置离店日期（必须晚于入住）
      const start = new Date(startDate).getTime();
      const current = new Date(date).getTime();
      if (current > start) {
        setEndDate(date);
      }
    } else {
      // 重新选择：清空离店，重置入住
      setStartDate(date);
      setEndDate('');
    }

    // 强制触发日历重新生成（确保样式即时更新）
    generateCalendar(currentYear, currentMonth);
  };

  // 确认选择
  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
      onClose();
    }
  };
  if (!visible) return null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.View, {
    className: "calendar-mask",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.View, {
      className: "calendar-container",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.View, {
        className: "calendar-header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.Text, {
          className: "header-title",
          children: [currentYear, "\u5E74", currentMonth, "\u6708"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.View, {
          className: "header-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.Text, {
            className: "action-btn",
            onClick: () => changeMonth('prev'),
            children: "\u4E0A\u6708"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.Text, {
            className: "action-btn",
            onClick: () => changeMonth('next'),
            children: "\u4E0B\u6708"
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.View, {
        className: "calendar-week",
        children: ['一', '二', '三', '四', '五', '六', '日'].map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.Text, {
          className: "week-item",
          children: item
        }, item))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.View, {
        className: "calendar-body",
        children: calendarData.map((item, index) => {
          const baseClass = 'calendar-item';
          const modifiers = [item.isCurrentMonth ? '' : 'not-current', item.isToday ? 'today' : '', item.isSelected ? 'selected' : '', item.isInRange ? 'in-range' : '', item.isStart ? 'start' : '', item.isEnd ? 'end' : ''].filter(Boolean).join(' ');
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.View, {
            className: `${baseClass} ${modifiers}`,
            onClick: () => selectDate(item.date)
            // 增加点击反馈（可选）
            ,
            hoverClass: "calendar-item-hover",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.Text, {
              className: "day-text",
              children: item.day
            })
          }, index);
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.View, {
        className: "calendar-footer",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.Text, {
          className: "cancel-btn",
          onClick: onClose,
          children: "\u53D6\u6D88"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_2__.Text, {
          className: `confirm-btn ${!startDate || !endDate ? 'disabled' : ''}`,
          onClick: handleConfirm,
          children: "\u786E\u8BA4"
        })]
      })]
    })
  });
};
/* harmony default export */ __webpack_exports__["default"] = (Calendar);

/***/ }),

/***/ "./src/pages/index/index.tsx":
/*!***********************************!*\
  !*** ./src/pages/index/index.tsx ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx");


var config = {"navigationBarTitleText":"首页"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"], 'pages/index/index', {root:{cn:[]}}, config || {})
if (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"] && _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","common"], function() { return __webpack_exec__("./src/pages/index/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map
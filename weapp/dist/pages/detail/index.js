"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/detail/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/detail/index!./src/pages/detail/index.tsx":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/detail/index!./src/pages/detail/index.tsx ***!
  \******************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "webpack/container/remote/@tarojs/taro");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/container/remote/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "webpack/container/remote/react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);





// 扩展酒店数据类型，包含所有必填维度

const HotelDetailPage = () => {
  const [hotelInfo, setHotelInfo] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);

  // 模拟酒店数据库（包含所有必填维度）
  const hotelDatabase = [{
    id: 'hotel_001',
    nameCn: 'XX精品酒店（市中心店）',
    nameEn: 'XX Boutique Hotel (Downtown)',
    star: 4,
    // 四星级
    address: '北京市朝阳区建国路88号',
    openTime: '2020-08',
    // 开业时间
    coverImage: 'https://picsum.photos/750/400?hotel1',
    roomTypes: [{
      name: '舒适大床房',
      price: 299,
      desc: '20㎡ | 1.8m床 | 无早餐'
    }, {
      name: '豪华双床房',
      price: 369,
      desc: '25㎡ | 1.2m*2床 | 含双早'
    }, {
      name: '行政套房',
      price: 599,
      desc: '40㎡ | 1.8m床 + 客厅 | 含双早'
    }],
    facilities: ['免费WiFi', '24小时热水', '停车场', '早餐'],
    desc: '紧邻地铁口，交通便利，房间宽敞明亮，配套设施齐全，是商务出行和旅游住宿的首选。'
  }, {
    id: 'hotel_002',
    nameCn: 'XX度假酒店（景区店）',
    nameEn: 'XX Resort Hotel (Scenic Area)',
    star: 5,
    // 五星级
    address: '杭州市西湖区龙井路12号',
    openTime: '2018-12',
    coverImage: 'https://picsum.photos/750/400?hotel2',
    roomTypes: [{
      name: '湖景大床房',
      price: 459,
      desc: '30㎡ | 1.8m床 | 含双早'
    }, {
      name: '亲子套房',
      price: 689,
      desc: '50㎡ | 1.8m+1.2m床 | 含3早'
    }, {
      name: '温泉别墅',
      price: 1299,
      desc: '80㎡ | 独栋 | 私汤温泉 | 含4早'
    }],
    facilities: ['湖景房', '温泉', '健身房', '接送服务'],
    desc: '直面西湖美景，推窗见景，度假风装修，配套温泉和健身设施，体验感拉满。'
  }];

  // 格式化开业时间：YYYY-MM → YYYY年MM月
  const formatOpenTime = time => {
    const [year, month] = time.split('-');
    return `${year}年${month}月`;
  };

  // 生成星级图标：4星 → ★★★★
  const renderStar = star => {
    let starStr = '';
    for (let i = 0; i < star; i++) {
      starStr += '★';
    }
    // 补充灰色空星（凑够5星展示）
    for (let i = star; i < 5; i++) {
      starStr += '☆';
    }
    return starStr;
  };

  // 页面加载：获取参数 + 匹配数据
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const pages = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;
    const hotelId = options.hotelId;
    const targetHotel = hotelDatabase.find(item => item.id === hotelId);
    if (targetHotel) {
      setHotelInfo(targetHotel);
    } else {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
        title: '未找到该酒店',
        icon: 'none'
      });
      setTimeout(() => _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().navigateBack(), 1500);
    }
    setLoading(false);
  }, []);

  // 加载中
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
      className: "loading-wrap",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
        className: "loading-text",
        children: "\u52A0\u8F7D\u4E2D..."
      })
    });
  }
  if (!hotelInfo) return null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
    className: "hotel-detail-page",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Image, {
      className: "hotel-cover",
      src: hotelInfo.coverImage,
      mode: "widthFix"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
      className: "hotel-base-info",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
        className: "hotel-name-cn",
        children: hotelInfo.nameCn
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
        className: "hotel-name-en",
        children: hotelInfo.nameEn
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
        className: "hotel-star-time",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
          className: "hotel-star",
          children: renderStar(hotelInfo.star)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
          className: "hotel-open-time",
          children: ["\u5F00\u4E1A\u65F6\u95F4\uFF1A", formatOpenTime(hotelInfo.openTime)]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
        className: "hotel-address",
        children: ["\uD83D\uDCCD ", hotelInfo.address]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
      className: "hotel-room-types",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
        className: "room-types-title",
        children: "\u623F\u578B\u5217\u8868"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
        className: "room-list",
        children: hotelInfo.roomTypes.map((room, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
          className: "room-item",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
            className: "room-left",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
              className: "room-name",
              children: room.name
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
              className: "room-desc",
              children: room.desc
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
            className: "room-right",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
              className: "room-price",
              children: ["\xA5", room.price]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
              className: "room-unit",
              children: "/\u665A"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
              className: "book-room-btn",
              size: "mini",
              children: "\u9884\u8BA2"
            })]
          })]
        }, index))
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
      className: "hotel-facilities",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
        className: "facilities-title",
        children: "\u9152\u5E97\u8BBE\u65BD"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
        className: "facilities-list",
        children: hotelInfo.facilities.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
          className: "facility-item",
          children: item
        }, index))
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
      className: "hotel-desc",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
        className: "desc-title",
        children: "\u9152\u5E97\u7B80\u4ECB"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Text, {
        className: "desc-content",
        children: hotelInfo.desc
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
      className: "book-btn-wrap",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        className: "book-btn",
        onClick: () => _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
          title: '预订功能待开发'
        }),
        children: "\u7ACB\u5373\u9884\u8BA2"
      })
    })]
  });
};
/* harmony default export */ __webpack_exports__["default"] = (HotelDetailPage);

/***/ }),

/***/ "./src/pages/detail/index.tsx":
/*!************************************!*\
  !*** ./src/pages/detail/index.tsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_detail_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/detail/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/detail/index!./src/pages/detail/index.tsx");


var config = {};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_detail_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"], 'pages/detail/index', {root:{cn:[]}}, config || {})
if (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_detail_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"] && _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_detail_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_detail_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_detail_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","common"], function() { return __webpack_exec__("./src/pages/detail/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map
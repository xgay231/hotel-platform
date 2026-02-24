export default defineAppConfig({
  pages: [
    'pages/index/index',      // 酒店查询页（首页）
    'pages/list/index',       // 酒店列表页
    'pages/detail/index'      // 酒店详情页
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '酒店预订',
    navigationBarTextStyle: 'black'
  }
})
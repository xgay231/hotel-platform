/**
 * Ant Design 主题配置
 * 统一管理全局主题 Token
 */

import { theme } from 'antd';

const { defaultAlgorithm } = theme;

export const appTheme = {
  algorithm: defaultAlgorithm,
  token: {
    // 主色调
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    // 字体
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji'`,
    fontSize: 14,

    // 圆角
    borderRadius: 6,

    // 间距
    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 20,
    paddingLG: 24,
    paddingXL: 32,
  },
  components: {
    // 按钮组件主题
    Button: {
      borderRadius: 6,
    },
    // 输入框组件主题
    Input: {
      borderRadius: 6,
    },
    // 表单组件主题
    Form: {
      itemMarginBottom: 20,
    },
    // 表格组件主题
    Table: {
      borderRadius: 6,
    },
    // 卡片组件主题
    Card: {
      borderRadius: 6,
    },
    // 模态框组件主题
    Modal: {
      borderRadius: 8,
    },
  },
};

export default appTheme;

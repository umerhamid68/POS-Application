import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: { //looked at online examples 
    colorPrimary: '#1890ff', 
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    borderRadius: 6,
    wireframe: false, 
    controlHeight: 40, 
    padding: 16,
    margin: 16,
    motion: true,
    motionBase: 0.2,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  components: {
    Card: {
      padding: 24,
      borderRadiusLG: 28,
    },
    Button: {
      borderRadius: 6,
      controlHeightLG: 48,
    },
    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 12,
    },
    Layout: {
      bodyBg: '#f0f2f5',        
    }
  }
};

export default theme;

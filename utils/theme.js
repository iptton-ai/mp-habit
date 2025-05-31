// 主题管理工具
const themeUtils = {
  // 预定义的可爱主题
  themes: {
    pink: {
      name: '💖 粉色公主',
      primary: '#FF69B4',
      primaryDark: '#FF1493',
      primaryLight: '#FFB6C1',
      secondary: '#FFF0F5',
      background: 'linear-gradient(135deg, #FFE4E6 0%, #FFF0F5 50%, #E8F5E8 100%)',
      cardBg: 'linear-gradient(145deg, #FFFFFF 0%, #FFF8FA 100%)',
      cardBorder: 'rgba(255, 182, 193, 0.3)',
      textPrimary: '#FF69B4',
      textSecondary: '#666666',
      emoji: '🌸',
      icon: '/images/theme-pink.png'
    },
    purple: {
      name: '💜 紫色梦幻',
      primary: '#9C27B0',
      primaryDark: '#7B1FA2',
      primaryLight: '#E1BEE7',
      secondary: '#F3E5F5',
      background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 50%, #E8F5E8 100%)',
      cardBg: 'linear-gradient(145deg, #FFFFFF 0%, #FAF8FF 100%)',
      cardBorder: 'rgba(156, 39, 176, 0.3)',
      textPrimary: '#9C27B0',
      textSecondary: '#666666',
      emoji: '🦄',
      icon: '/images/theme-purple.png'
    },
    blue: {
      name: '💙 蓝色海洋',
      primary: '#2196F3',
      primaryDark: '#1976D2',
      primaryLight: '#BBDEFB',
      secondary: '#E3F2FD',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E8F5E8 100%)',
      cardBg: 'linear-gradient(145deg, #FFFFFF 0%, #F8FBFF 100%)',
      cardBorder: 'rgba(33, 150, 243, 0.3)',
      textPrimary: '#2196F3',
      textSecondary: '#666666',
      emoji: '🌊',
      icon: '/images/theme-blue.png'
    },
    green: {
      name: '💚 绿色自然',
      primary: '#4CAF50',
      primaryDark: '#388E3C',
      primaryLight: '#C8E6C9',
      secondary: '#E8F5E9',
      background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)',
      cardBg: 'linear-gradient(145deg, #FFFFFF 0%, #F8FFF8 100%)',
      cardBorder: 'rgba(76, 175, 80, 0.3)',
      textPrimary: '#4CAF50',
      textSecondary: '#666666',
      emoji: '🌿',
      icon: '/images/theme-green.png'
    },
    orange: {
      name: '🧡 橙色活力',
      primary: '#FF9800',
      primaryDark: '#F57C00',
      primaryLight: '#FFE0B2',
      secondary: '#FFF3E0',
      background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)',
      cardBg: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBF8 100%)',
      cardBorder: 'rgba(255, 152, 0, 0.3)',
      textPrimary: '#FF9800',
      textSecondary: '#666666',
      emoji: '🍊',
      icon: '/images/theme-orange.png'
    },
    red: {
      name: '❤️ 红色热情',
      primary: '#F44336',
      primaryDark: '#D32F2F',
      primaryLight: '#FFCDD2',
      secondary: '#FFEBEE',
      background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 50%, #EF9A9A 100%)',
      cardBg: 'linear-gradient(145deg, #FFFFFF 0%, #FFF8F8 100%)',
      cardBorder: 'rgba(244, 67, 54, 0.3)',
      textPrimary: '#F44336',
      textSecondary: '#666666',
      emoji: '🌹',
      icon: '/images/theme-red.png'
    }
  },

  // 获取当前主题
  getCurrentTheme() {
    const currentThemeKey = wx.getStorageSync('currentTheme') || 'pink'
    return this.themes[currentThemeKey] || this.themes.pink
  },

  // 设置主题
  setTheme(themeKey) {
    if (this.themes[themeKey]) {
      wx.setStorageSync('currentTheme', themeKey)
      return this.themes[themeKey]
    }
    return this.themes.pink
  },

  // 获取所有主题列表
  getAllThemes() {
    return Object.keys(this.themes).map(key => ({
      key,
      ...this.themes[key]
    }))
  },

  // 应用主题到页面
  applyTheme(page) {
    const theme = this.getCurrentTheme()
    
    // 设置页面数据
    if (page && page.setData) {
      page.setData({
        currentTheme: theme
      })
    }

    // 动态设置导航栏颜色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: theme.primary,
      animation: {
        duration: 300,
        timingFunc: 'easeIn'
      }
    })

    return theme
  },

  // 生成主题CSS变量
  generateThemeCSS(theme) {
    return `
      --theme-primary: ${theme.primary};
      --theme-primary-dark: ${theme.primaryDark};
      --theme-primary-light: ${theme.primaryLight};
      --theme-secondary: ${theme.secondary};
      --theme-background: ${theme.background};
      --theme-card-bg: ${theme.cardBg};
      --theme-card-border: ${theme.cardBorder};
      --theme-text-primary: ${theme.textPrimary};
      --theme-text-secondary: ${theme.textSecondary};
    `
  }
}

module.exports = {
  themeUtils
}

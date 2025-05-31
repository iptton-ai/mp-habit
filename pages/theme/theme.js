// pages/theme/theme.js
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    themes: [],
    currentThemeKey: 'pink'
  },

  onLoad() {
    this.loadThemes()
  },

  onShow() {
    // 应用当前主题
    themeUtils.applyTheme(this)
  },

  loadThemes() {
    const themes = themeUtils.getAllThemes()
    const currentThemeKey = wx.getStorageSync('currentTheme') || 'pink'
    
    this.setData({
      themes,
      currentThemeKey
    })
  },

  // 选择主题
  selectTheme(e) {
    const { themeKey } = e.currentTarget.dataset
    
    // 设置新主题
    const newTheme = themeUtils.setTheme(themeKey)
    
    // 更新当前选择
    this.setData({
      currentThemeKey: themeKey
    })

    // 应用新主题
    themeUtils.applyTheme(this)

    // 显示成功提示
    wx.showToast({
      title: `已切换到${newTheme.name}`,
      icon: 'success',
      duration: 1500
    })

    // 延迟一下再触发页面更新，让用户看到效果
    setTimeout(() => {
      // 通知其他页面主题已更改
      const pages = getCurrentPages()
      pages.forEach(page => {
        if (page.route !== 'pages/theme/theme' && page.onThemeChange) {
          page.onThemeChange(newTheme)
        }
      })
    }, 300)
  },

  // 预览主题效果
  previewTheme(e) {
    const { themeKey } = e.currentTarget.dataset
    const theme = themeUtils.themes[themeKey]
    
    // 临时应用主题预览
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: theme.primary,
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })

    // 更新页面主题数据用于预览
    this.setData({
      currentTheme: theme
    })
  },

  // 恢复当前主题
  restoreTheme() {
    themeUtils.applyTheme(this)
  }
})

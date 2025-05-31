// pages/settings/settings.js
const { pointUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    totalPoints: 0,
    version: '1.0.0',
    currentTheme: null
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
    // 应用当前主题
    themeUtils.applyTheme(this)
  },

  loadData() {
    const totalPoints = pointUtils.getTotalPoints()
    const currentTheme = themeUtils.getCurrentTheme()
    this.setData({
      totalPoints,
      currentTheme
    })
  },

  // 主题更改回调
  onThemeChange(newTheme) {
    this.setData({
      currentTheme: newTheme
    })
  },

  // 跳转到主题设置
  goToTheme() {
    wx.navigateTo({
      url: '/pages/theme/theme'
    })
  },

  // 重置积分
  resetPoints() {
    wx.showModal({
      title: '确认重置',
      content: '确认将积分重置为0吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          pointUtils.setPoints(0)
          this.loadData()
          
          wx.showToast({
            title: '积分已重置',
            icon: 'success'
          })
        }
      }
    })
  },

  // 清空所有数据
  clearAllData() {
    wx.showModal({
      title: '确认清空',
      content: '确认清空所有数据吗？包括习惯、奖励、记录和积分，此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '再次确认',
            content: '这将删除所有数据，确定要继续吗？',
            success: (res2) => {
              if (res2.confirm) {
                // 保存当前主题设置
                const currentThemeKey = wx.getStorageSync('currentTheme')

                // 清空所有存储数据
                wx.clearStorageSync()

                // 恢复主题设置
                if (currentThemeKey) {
                  wx.setStorageSync('currentTheme', currentThemeKey)
                }

                // 重新初始化
                getApp().initData()
                this.loadData()

                wx.showToast({
                  title: '数据已清空',
                  icon: 'success'
                })
              }
            }
          })
        }
      }
    })
  },

  // 导出数据
  exportData() {
    try {
      const data = {
        habits: wx.getStorageSync('habits') || [],
        rewards: wx.getStorageSync('rewards') || [],
        records: wx.getStorageSync('records') || [],
        totalPoints: wx.getStorageSync('totalPoints') || 0,
        currentTheme: wx.getStorageSync('currentTheme') || 'pink',
        exportTime: new Date().toISOString()
      }

      const dataStr = JSON.stringify(data, null, 2)
      
      wx.setClipboardData({
        data: dataStr,
        success: () => {
          wx.showToast({
            title: '数据已复制到剪贴板',
            icon: 'success'
          })
        }
      })
    } catch (error) {
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      })
    }
  },

  // 关于应用
  showAbout() {
    wx.showModal({
      title: '关于习惯小助手',
      content: `版本：${this.data.version}\n\n这是一个帮助小朋友养成良好习惯的小程序。通过完成习惯获得积分，用积分兑换奖励，让养成好习惯变得更有趣！`,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 使用帮助
  showHelp() {
    wx.showModal({
      title: '使用帮助',
      content: '1. 在"习惯"页面添加要养成的习惯\n2. 在"奖励"页面添加想要的奖励\n3. 完成习惯获得积分\n4. 用积分兑换奖励\n5. 在"记录"页面查看历史记录',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})

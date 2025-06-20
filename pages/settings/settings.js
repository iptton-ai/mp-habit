// pages/settings/settings.js
const { pointUtils, userUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    totalPoints: 0,
    version: '1.3.0',
    currentTheme: null,
    currentUser: null,
    usersCount: 0
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
    const currentUser = userUtils.getCurrentUser()
    const usersCount = userUtils.getUsers().length

    this.setData({
      totalPoints,
      currentTheme,
      currentUser,
      usersCount
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

  // 跳转到用户管理
  goToUsers() {
    wx.navigateTo({
      url: '/pages/users/users'
    })
  },

  // 快速切换用户
  quickSwitchUser() {
    const users = userUtils.getUsers()
    const currentUserId = userUtils.getCurrentUserId()

    if (users.length <= 1) {
      wx.showToast({
        title: '只有一个用户',
        icon: 'none'
      })
      return
    }

    const actionSheet = users
      .filter(user => user.id !== currentUserId)
      .map(user => `${user.avatar} ${user.name}`)

    wx.showActionSheet({
      itemList: actionSheet,
      success: (res) => {
        const selectedUser = users.filter(user => user.id !== currentUserId)[res.tapIndex]
        if (selectedUser) {
          userUtils.setCurrentUser(selectedUser.id)

          // 重新加载数据和应用主题
          this.loadData()
          themeUtils.applyTheme(this)

          wx.showToast({
            title: `已切换到 ${selectedUser.name}`,
            icon: 'success'
          })
        }
      }
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
      content: '1. 在"习惯"页面添加要养成的习惯\n2. 在"奖励"页面添加想要的奖励\n3. 完成习惯获得积分\n4. 用积分兑换奖励\n5. 在"记录"页面查看历史记录\n6. 在"用户管理"中可以添加多个用户',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 分享应用
  shareApp() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    // 触发分享
    wx.shareAppMessage({
      title: '🌟 习惯小助手 - 让养成好习惯变得更有趣！',
      desc: '支持多用户管理，每个人都可以有自己的习惯追踪空间',
      path: '/pages/index/index',
      imageUrl: '', // 可以设置分享图片
      success: (res) => {
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        })

        // 分享成功后跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      },
      fail: (res) => {
        wx.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    })
  },

  // 分享页面
  onShareAppMessage() {
    return {
      title: '🌟 我在用习惯小助手管理生活！',
      desc: '支持多用户管理，每个人都可以有自己的习惯追踪空间',
      path: '/pages/index/index',
      imageUrl: ''
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '🌟 习惯小助手 - 让养成好习惯变得更有趣！',
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})

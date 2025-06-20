// pages/index/index.js
const { habitUtils, rewardUtils, pointUtils, recordUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    totalPoints: 0,
    todayHabits: [],
    todayRewards: [],
    todayRecords: [],
    greeting: '',
    currentTheme: null
  },

  onLoad() {
    this.setGreeting()
    this.loadData()
  },

  onShow() {
    this.loadData()
    // 应用当前主题
    themeUtils.applyTheme(this)
  },

  // 主题更改回调
  onThemeChange(newTheme) {
    this.setData({
      currentTheme: newTheme
    })
  },

  setGreeting() {
    const hour = new Date().getHours()
    let greeting = ''
    if (hour < 6) {
      greeting = '夜深了，早点休息哦！'
    } else if (hour < 12) {
      greeting = '早上好！新的一天开始啦！'
    } else if (hour < 18) {
      greeting = '下午好！继续加油哦！'
    } else {
      greeting = '晚上好！今天表现怎么样？'
    }
    this.setData({ greeting })
  },

  loadData() {
    const totalPoints = pointUtils.getTotalPoints()
    const habits = habitUtils.getHabits()
    const rewards = rewardUtils.getRewards()
    const todayRecords = recordUtils.getTodayRecords()
    const currentTheme = themeUtils.getCurrentTheme()

    // 获取所有习惯（允许多次完成）
    const todayHabits = habits

    // 获取可以兑换的奖励（允许多次兑换）
    const todayRewards = rewards.filter(r => r.points <= totalPoints)

    this.setData({
      totalPoints,
      todayHabits: todayHabits.slice(0, 5), // 只显示前5个
      todayRewards: todayRewards.slice(0, 3), // 只显示前3个
      todayRecords: todayRecords.slice(0, 5), // 只显示最近5条
      currentTheme
    })
  },

  // 完成习惯
  completeHabit(e) {
    const { habit } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认完成',
      content: `确认完成习惯"${habit.name}"吗？将获得${habit.points}积分。`,
      success: (res) => {
        if (res.confirm) {
          const record = {
            type: 'habit',
            itemId: habit.id,
            itemName: habit.name,
            points: habit.points,
            action: 'complete'
          }
          
          recordUtils.addRecord(record)
          this.loadData()
          
          wx.showToast({
            title: `获得${habit.points}积分！`,
            icon: 'success'
          })
        }
      }
    })
  },

  // 兑换奖励
  redeemReward(e) {
    const { reward } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认兑换',
      content: `确认兑换奖励"${reward.name}"吗？需要消耗${reward.points}积分。`,
      success: (res) => {
        if (res.confirm) {
          const record = {
            type: 'reward',
            itemId: reward.id,
            itemName: reward.name,
            points: reward.points,
            action: 'redeem'
          }
          
          recordUtils.addRecord(record)
          this.loadData()
          
          wx.showToast({
            title: '兑换成功！',
            icon: 'success'
          })
        }
      }
    })
  },

  // 取消记录
  cancelRecord(e) {
    const { record } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认取消',
      content: `确认取消这条记录吗？`,
      success: (res) => {
        if (res.confirm) {
          recordUtils.cancelRecord(record.id)
          this.loadData()
          
          wx.showToast({
            title: '已取消',
            icon: 'success'
          })
        }
      }
    })
  },

  // 跳转到习惯页面
  goToHabits() {
    wx.switchTab({
      url: '/pages/habits/habits'
    })
  },

  // 跳转到奖励页面
  goToRewards() {
    wx.switchTab({
      url: '/pages/rewards/rewards'
    })
  },

  // 跳转到记录页面
  goToRecords() {
    wx.switchTab({
      url: '/pages/records/records'
    })
  },

  // 分享页面
  onShareAppMessage() {
    return {
      title: '🌟 我在用习惯小助手养成好习惯！',
      desc: '支持多用户管理，一起来养成好习惯吧！',
      path: '/pages/index/index',
      imageUrl: '' // 可以设置分享图片
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '🌟 习惯小助手 - 让养成好习惯变得更有趣！',
      path: '/pages/index/index',
      imageUrl: '' // 可以设置分享图片
    }
  }
})

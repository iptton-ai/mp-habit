// pages/records/records.js
const { recordUtils, pointUtils, formatTime } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    records: [],
    totalPoints: 0,
    filterType: 'all', // all, habit, reward
    filterOptions: [
      { value: 'all', label: '全部记录' },
      { value: 'habit', label: '习惯记录' },
      { value: 'reward', label: '奖励记录' }
    ],
    currentFilterIndex: 0,
    currentFilterLabel: '全部记录',
    filteredRecords: [],
    currentTheme: null,
    stats: {
      totalHabits: 0,
      totalRewards: 0,
      totalPointsEarned: 0,
      totalPointsSpent: 0
    }
  },

  onLoad() {
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

  loadData() {
    const records = recordUtils.getRecords()
    const totalPoints = pointUtils.getTotalPoints()
    const currentTheme = themeUtils.getCurrentTheme()

    // 计算统计数据
    const stats = this.calculateStats(records)

    // 更新当前筛选显示
    const currentFilterOption = this.data.filterOptions.find(option => option.value === this.data.filterType)
    const currentFilterIndex = this.data.filterOptions.findIndex(option => option.value === this.data.filterType)

    this.setData({
      records,
      totalPoints,
      currentTheme,
      stats,
      currentFilterIndex: currentFilterIndex >= 0 ? currentFilterIndex : 0,
      currentFilterLabel: currentFilterOption ? currentFilterOption.label : '全部记录'
    })

    this.filterRecords()
  },

  calculateStats(records) {
    const stats = {
      totalHabits: 0,
      totalRewards: 0,
      totalPointsEarned: 0,
      totalPointsSpent: 0
    }

    records.forEach(record => {
      if (record.type === 'habit') {
        stats.totalHabits++
        if (record.points > 0) {
          stats.totalPointsEarned += record.points
        } else {
          stats.totalPointsSpent += Math.abs(record.points)
        }
      } else if (record.type === 'reward') {
        stats.totalRewards++
        stats.totalPointsSpent += record.points
      }
    })

    return stats
  },

  // 筛选记录
  filterRecords() {
    const { records, filterType } = this.data
    let filteredRecords = records

    if (filterType === 'habit') {
      filteredRecords = records.filter(r => r.type === 'habit')
    } else if (filterType === 'reward') {
      filteredRecords = records.filter(r => r.type === 'reward')
    }

    this.setData({ filteredRecords })
  },

  // 切换筛选类型
  onFilterChange(e) {
    const index = e.detail.value
    const filterOption = this.data.filterOptions[index]
    this.setData({
      filterType: filterOption.value,
      currentFilterIndex: index,
      currentFilterLabel: filterOption.label
    })
    this.filterRecords()
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

  // 清空所有记录
  clearAllRecords() {
    wx.showModal({
      title: '确认清空',
      content: '确认清空所有记录吗？此操作不可恢复，积分将重置为0。',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('records', [])
          pointUtils.setPoints(0)
          this.loadData()
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  // 格式化时间
  formatRecordTime(timestamp) {
    return formatTime(new Date(timestamp))
  },

  // 分享页面
  onShareAppMessage() {
    return {
      title: '🌟 我在用习惯小助手记录成长！',
      desc: '支持多用户管理，一起来养成好习惯吧！',
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

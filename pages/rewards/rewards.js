// pages/rewards/rewards.js
const { rewardUtils, recordUtils, pointUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    rewards: [],
    totalPoints: 0,
    showTemplates: false,
    templates: [],
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

  // 主题更改回调
  onThemeChange(newTheme) {
    this.setData({
      currentTheme: newTheme
    })
  },

  loadData() {
    const rewards = rewardUtils.getRewards()
    const templates = rewardUtils.getRewardTemplates()
    const totalPoints = pointUtils.getTotalPoints()
    const currentTheme = themeUtils.getCurrentTheme()

    this.setData({
      rewards,
      templates,
      totalPoints,
      currentTheme
    })
  },

  // 添加新奖励
  addReward() {
    wx.navigateTo({
      url: '/pages/reward-detail/reward-detail?mode=add'
    })
  },

  // 编辑奖励
  editReward(e) {
    const { reward } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/reward-detail/reward-detail?mode=edit&id=${reward.id}`
    })
  },

  // 删除奖励
  deleteReward(e) {
    const { reward } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认删除',
      content: `确认删除奖励"${reward.name}"吗？此操作不可恢复。`,
      success: (res) => {
        if (res.confirm) {
          rewardUtils.deleteReward(reward.id)
          this.loadData()
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 兑换奖励
  redeemReward(e) {
    const { reward } = e.currentTarget.dataset
    const { totalPoints } = this.data
    
    if (totalPoints < reward.points) {
      wx.showToast({
        title: '积分不足',
        icon: 'none'
      })
      return
    }
    
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

  // 显示/隐藏模板
  toggleTemplates() {
    this.setData({
      showTemplates: !this.data.showTemplates
    })
  },

  // 使用模板添加奖励
  useTemplate(e) {
    const { template } = e.currentTarget.dataset

    // 跳转到奖励详情页面，预填模板数据
    const templateData = encodeURIComponent(JSON.stringify({
      name: template.name,
      points: template.points
    }))

    wx.navigateTo({
      url: `/pages/reward-detail/reward-detail?mode=add&template=${templateData}`
    })
  }
})

// pages/habits/habits.js
const { habitUtils, recordUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    habits: [],
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
    const habits = habitUtils.getHabits()
    const templates = habitUtils.getHabitTemplates()
    const currentTheme = themeUtils.getCurrentTheme()
    this.setData({
      habits,
      templates,
      currentTheme
    })
  },

  // 添加新习惯
  addHabit() {
    wx.navigateTo({
      url: '/pages/habit-detail/habit-detail?mode=add'
    })
  },

  // 编辑习惯
  editHabit(e) {
    const { habit } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/habit-detail/habit-detail?mode=edit&id=${habit.id}`
    })
  },

  // 删除习惯
  deleteHabit(e) {
    const { habit } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认删除',
      content: `确认删除习惯"${habit.name}"吗？此操作不可恢复。`,
      success: (res) => {
        if (res.confirm) {
          habitUtils.deleteHabit(habit.id)
          this.loadData()
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
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
          
          wx.showToast({
            title: `获得${habit.points}积分！`,
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

  // 使用模板添加习惯
  useTemplate(e) {
    const { template } = e.currentTarget.dataset

    // 跳转到习惯详情页面，预填模板数据
    const templateData = encodeURIComponent(JSON.stringify({
      name: template.name,
      points: Math.abs(template.points),
      type: template.type
    }))

    wx.navigateTo({
      url: `/pages/habit-detail/habit-detail?mode=add&template=${templateData}`
    })
  }
})

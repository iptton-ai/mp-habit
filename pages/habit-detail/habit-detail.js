// pages/habit-detail/habit-detail.js
const { habitUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    mode: 'add', // add 或 edit
    habitId: '',
    currentTheme: null,
    formData: {
      name: '',
      points: 5,
      type: 'positive'
    },
    pointsOptions: [5, 10, 15, 20, 30, 50, 80, 100, 150, 200],
    typeOptions: [
      { value: 'positive', label: '好习惯（获得积分）' },
      { value: 'negative', label: '坏习惯（扣除积分）' }
    ]
  },

  onLoad(options) {
    const { mode, id, template } = options
    this.setData({ mode, habitId: id || '' })

    if (mode === 'edit' && id) {
      this.loadHabitData(id)
    } else if (mode === 'add' && template) {
      // 如果有模板数据，预填表单
      this.loadTemplateData(template)
    }

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: mode === 'add' ? '添加习惯' : '编辑习惯'
    })
  },

  onShow() {
    // 应用当前主题
    const currentTheme = themeUtils.applyTheme(this)
    this.setData({ currentTheme })
  },

  loadHabitData(habitId) {
    const habits = habitUtils.getHabits()
    const habit = habits.find(h => h.id === habitId)

    if (habit) {
      this.setData({
        formData: {
          name: habit.name,
          points: Math.abs(habit.points),
          type: habit.points > 0 ? 'positive' : 'negative'
        }
      })
    }
  },

  loadTemplateData(templateStr) {
    try {
      const template = JSON.parse(decodeURIComponent(templateStr))
      this.setData({
        formData: {
          name: template.name,
          points: template.points,
          type: template.type
        }
      })
    } catch (error) {
      console.error('模板数据解析失败:', error)
    }
  },

  // 输入习惯名称
  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    })
  },

  // 选择积分
  onPointsChange(e) {
    const points = this.data.pointsOptions[e.detail.value]
    this.setData({
      'formData.points': points
    })
  },

  // 选择类型
  onTypeChange(e) {
    const type = this.data.typeOptions[e.detail.value].value
    this.setData({
      'formData.type': type
    })
  },

  // 保存习惯
  saveHabit() {
    const { formData, mode, habitId } = this.data

    // 验证表单
    if (!formData.name.trim()) {
      wx.showToast({
        title: '请输入习惯名称',
        icon: 'none'
      })
      return
    }

    // 准备保存的数据
    const habitData = {
      name: formData.name.trim(),
      points: formData.type === 'positive' ? formData.points : -formData.points,
      type: formData.type
    }

    try {
      if (mode === 'add') {
        habitUtils.addHabit(habitData)
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
      } else {
        habitUtils.updateHabit(habitId, habitData)
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
      }

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)

    } catch (error) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  },

  // 取消操作
  cancel() {
    wx.navigateBack()
  },

  // 分享页面
  onShareAppMessage() {
    const { mode, formData } = this.data
    const habitName = formData.name || '好习惯'
    return {
      title: `🌟 我在用习惯小助手${mode === 'add' ? '添加' : '管理'}习惯：${habitName}`,
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

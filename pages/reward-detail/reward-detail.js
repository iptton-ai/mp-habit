// pages/reward-detail/reward-detail.js
const { rewardUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    mode: 'add', // add 或 edit
    rewardId: '',
    currentTheme: null,
    formData: {
      name: '',
      points: 20
    },
    pointsOptions: [10, 15, 20, 25, 30, 40, 50, 80, 100, 150, 200]
  },

  onLoad(options) {
    const { mode, id, template } = options
    this.setData({ mode, rewardId: id || '' })

    if (mode === 'edit' && id) {
      this.loadRewardData(id)
    } else if (mode === 'add' && template) {
      // 如果有模板数据，预填表单
      this.loadTemplateData(template)
    }

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: mode === 'add' ? '添加奖励' : '编辑奖励'
    })
  },

  onShow() {
    // 应用当前主题
    const currentTheme = themeUtils.applyTheme(this)
    this.setData({ currentTheme })
  },

  loadRewardData(rewardId) {
    const rewards = rewardUtils.getRewards()
    const reward = rewards.find(r => r.id === rewardId)

    if (reward) {
      this.setData({
        formData: {
          name: reward.name,
          points: reward.points
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
          points: template.points
        }
      })
    } catch (error) {
      console.error('模板数据解析失败:', error)
    }
  },

  // 输入奖励名称
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

  // 自定义积分输入
  onCustomPointsInput(e) {
    const points = parseInt(e.detail.value) || 0
    this.setData({
      'formData.points': Math.max(1, Math.min(1000, points))
    })
  },

  // 保存奖励
  saveReward() {
    const { formData, mode, rewardId } = this.data

    // 验证表单
    if (!formData.name.trim()) {
      wx.showToast({
        title: '请输入奖励名称',
        icon: 'none'
      })
      return
    }

    if (formData.points <= 0) {
      wx.showToast({
        title: '积分必须大于0',
        icon: 'none'
      })
      return
    }

    // 准备保存的数据
    const rewardData = {
      name: formData.name.trim(),
      points: formData.points
    }

    try {
      if (mode === 'add') {
        rewardUtils.addReward(rewardData)
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
      } else {
        rewardUtils.updateReward(rewardId, rewardData)
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
  }
})

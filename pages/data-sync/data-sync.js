// pages/data-sync/data-sync.js
const { userUtils, habitUtils, rewardUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    currentUser: null,
    otherUsers: [],
    selectedUserId: null,
    selectedUser: null,
    syncType: 'habits', // habits, rewards
    
    // 源用户数据
    sourceHabits: [],
    sourceRewards: [],
    
    // 选中的数据
    selectedHabits: [],
    selectedRewards: [],
    
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
    const currentUser = userUtils.getCurrentUser()
    const allUsers = userUtils.getUsers()
    const otherUsers = allUsers.filter(user => user.id !== currentUser.id)
    const currentTheme = themeUtils.getCurrentTheme()

    this.setData({
      currentUser,
      otherUsers,
      currentTheme,
      selectedUserId: null,
      selectedUser: null,
      sourceHabits: [],
      sourceRewards: [],
      selectedHabits: [],
      selectedRewards: []
    })
  },

  // 选择源用户
  selectSourceUser(e) {
    const { userId } = e.currentTarget.dataset
    const selectedUser = this.data.otherUsers.find(user => user.id === userId)

    if (selectedUser) {
      const sourceHabits = habitUtils.getHabits(userId)
      const sourceRewards = rewardUtils.getRewards(userId)

      // 为每个项目添加选中状态
      const sourceHabitsWithSelected = sourceHabits.map(habit => ({
        ...habit,
        selected: false
      }))

      const sourceRewardsWithSelected = sourceRewards.map(reward => ({
        ...reward,
        selected: false
      }))

      this.setData({
        selectedUserId: userId,
        selectedUser,
        sourceHabits: sourceHabitsWithSelected,
        sourceRewards: sourceRewardsWithSelected,
        selectedHabits: [],
        selectedRewards: []
      })
    }
  },

  // 清除源用户选择
  clearSourceSelection() {
    this.setData({
      selectedUserId: null,
      selectedUser: null,
      sourceHabits: [],
      sourceRewards: [],
      selectedHabits: [],
      selectedRewards: []
    })
  },

  // 切换同步类型
  switchSyncType(e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      syncType: type,
      selectedHabits: [],
      selectedRewards: []
    })
  },

  // 选择/取消选择习惯
  toggleHabit(e) {
    const { habitId } = e.currentTarget.dataset
    const { selectedHabits, sourceHabits } = this.data

    let newSelectedHabits
    const index = selectedHabits.indexOf(habitId)
    if (index > -1) {
      // 取消选择：创建新数组，排除当前项
      newSelectedHabits = selectedHabits.filter(id => id !== habitId)
    } else {
      // 选择：创建新数组，添加当前项
      newSelectedHabits = [...selectedHabits, habitId]
    }

    // 同时更新sourceHabits中的selected状态
    const newSourceHabits = sourceHabits.map(habit => ({
      ...habit,
      selected: newSelectedHabits.indexOf(habit.id) > -1
    }))

    this.setData({
      selectedHabits: newSelectedHabits,
      sourceHabits: newSourceHabits
    })
  },

  // 选择/取消选择奖励
  toggleReward(e) {
    const { rewardId } = e.currentTarget.dataset
    const { selectedRewards, sourceRewards } = this.data

    console.log('toggleReward 开始:', {
      rewardId,
      rewardIdType: typeof rewardId,
      selectedRewards,
      sourceRewards: sourceRewards.map(r => ({ id: r.id, type: typeof r.id }))
    })

    let newSelectedRewards
    const index = selectedRewards.indexOf(rewardId)
    if (index > -1) {
      // 取消选择：创建新数组，排除当前项
      newSelectedRewards = selectedRewards.filter(id => id !== rewardId)
    } else {
      // 选择：创建新数组，添加当前项
      newSelectedRewards = [...selectedRewards, rewardId]
    }

    // 同时更新sourceRewards中的selected状态
    const newSourceRewards = sourceRewards.map(reward => ({
      ...reward,
      selected: newSelectedRewards.indexOf(reward.id) > -1
    }))

    console.log('toggleReward 结果:', {
      rewardId,
      index,
      newSelectedRewards,
      includes: newSelectedRewards.includes(rewardId)
    })

    this.setData({
      selectedRewards: newSelectedRewards,
      sourceRewards: newSourceRewards
    }, () => {
      console.log('setData 完成后:', this.data.selectedRewards)
    })
  },

  // 全选/取消全选
  toggleSelectAll() {
    const { syncType, sourceHabits, sourceRewards, selectedHabits, selectedRewards } = this.data

    console.log('toggleSelectAll 开始:', {
      syncType,
      sourceHabitsLength: sourceHabits.length,
      selectedHabitsLength: selectedHabits.length,
      sourceRewardsLength: sourceRewards.length,
      selectedRewardsLength: selectedRewards.length
    })

    if (syncType === 'habits') {
      if (selectedHabits.length === sourceHabits.length) {
        // 取消全选
        console.log('取消全选习惯')
        const newSourceHabits = sourceHabits.map(habit => ({
          ...habit,
          selected: false
        }))
        this.setData({
          selectedHabits: [],
          sourceHabits: newSourceHabits
        })
      } else {
        // 全选
        const allHabitIds = sourceHabits.map(h => h.id)
        const newSourceHabits = sourceHabits.map(habit => ({
          ...habit,
          selected: true
        }))
        console.log('全选习惯:', allHabitIds)
        this.setData({
          selectedHabits: allHabitIds,
          sourceHabits: newSourceHabits
        })
      }
    } else {
      if (selectedRewards.length === sourceRewards.length) {
        // 取消全选
        console.log('取消全选奖励')
        const newSourceRewards = sourceRewards.map(reward => ({
          ...reward,
          selected: false
        }))
        this.setData({
          selectedRewards: [],
          sourceRewards: newSourceRewards
        })
      } else {
        // 全选
        const allRewardIds = sourceRewards.map(r => r.id)
        const newSourceRewards = sourceRewards.map(reward => ({
          ...reward,
          selected: true
        }))
        console.log('全选奖励:', allRewardIds)
        this.setData({
          selectedRewards: allRewardIds,
          sourceRewards: newSourceRewards
        })
      }
    }
  },

  // 开始同步
  startSync() {
    const { 
      selectedUserId, 
      selectedUser, 
      currentUser, 
      syncType, 
      selectedHabits, 
      selectedRewards,
      sourceHabits,
      sourceRewards
    } = this.data
    
    if (!selectedUserId) {
      wx.showToast({
        title: '请选择源用户',
        icon: 'none'
      })
      return
    }
    
    const selectedCount = syncType === 'habits' ? selectedHabits.length : selectedRewards.length
    if (selectedCount === 0) {
      wx.showToast({
        title: `请选择要同步的${syncType === 'habits' ? '习惯' : '奖励'}`,
        icon: 'none'
      })
      return
    }
    
    const typeName = syncType === 'habits' ? '习惯' : '奖励'
    wx.showModal({
      title: '确认同步',
      content: `确认从"${selectedUser.name}"复制${selectedCount}个${typeName}到"${currentUser.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          this.performSync()
        }
      }
    })
  },

  // 执行同步
  performSync() {
    const { 
      selectedUserId, 
      currentUser, 
      syncType, 
      selectedHabits, 
      selectedRewards,
      sourceHabits,
      sourceRewards
    } = this.data
    
    try {
      if (syncType === 'habits') {
        // 复制选中的习惯
        const habitsToSync = sourceHabits.filter(h => selectedHabits.includes(h.id))
        habitsToSync.forEach(habit => {
          const newHabit = {
            ...habit,
            id: undefined, // 让addHabit生成新ID
            createTime: undefined
          }
          habitUtils.addHabit(newHabit, currentUser.id)
        })
        
        wx.showToast({
          title: `成功复制${habitsToSync.length}个习惯`,
          icon: 'success'
        })
      } else {
        // 复制选中的奖励
        const rewardsToSync = sourceRewards.filter(r => selectedRewards.includes(r.id))
        rewardsToSync.forEach(reward => {
          const newReward = {
            ...reward,
            id: undefined, // 让addReward生成新ID
            createTime: undefined
          }
          rewardUtils.addReward(newReward, currentUser.id)
        })
        
        wx.showToast({
          title: `成功复制${rewardsToSync.length}个奖励`,
          icon: 'success'
        })
      }
      
      // 延迟返回
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      
    } catch (error) {
      wx.showToast({
        title: '同步失败',
        icon: 'none'
      })
    }
  },

  // 分享页面
  onShareAppMessage() {
    return {
      title: '🌟 我在用习惯小助手同步数据！',
      desc: '支持多用户管理，可以在用户间同步习惯和奖励',
      path: '/pages/index/index',
      imageUrl: ''
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '🌟 习惯小助手 - 多用户数据同步功能超棒！',
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})

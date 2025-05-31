// 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 获取今天的日期字符串
const getTodayString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

// 习惯相关操作
const habitUtils = {
  // 获取所有习惯
  getHabits() {
    return wx.getStorageSync('habits') || []
  },

  // 保存习惯
  saveHabits(habits) {
    wx.setStorageSync('habits', habits)
  },

  // 添加习惯
  addHabit(habit) {
    const habits = this.getHabits()
    habit.id = generateId()
    habit.createTime = Date.now()
    habits.push(habit)
    this.saveHabits(habits)
    return habit
  },

  // 更新习惯
  updateHabit(habitId, updates) {
    const habits = this.getHabits()
    const index = habits.findIndex(h => h.id === habitId)
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates }
      this.saveHabits(habits)
      return habits[index]
    }
    return null
  },

  // 删除习惯
  deleteHabit(habitId) {
    const habits = this.getHabits()
    const filteredHabits = habits.filter(h => h.id !== habitId)
    this.saveHabits(filteredHabits)
  },

  // 获取习惯模板
  getHabitTemplates() {
    return wx.getStorageSync('habitTemplates') || []
  }
}

// 奖励相关操作
const rewardUtils = {
  // 获取所有奖励
  getRewards() {
    return wx.getStorageSync('rewards') || []
  },

  // 保存奖励
  saveRewards(rewards) {
    wx.setStorageSync('rewards', rewards)
  },

  // 添加奖励
  addReward(reward) {
    const rewards = this.getRewards()
    reward.id = generateId()
    reward.createTime = Date.now()
    rewards.push(reward)
    this.saveRewards(rewards)
    return reward
  },

  // 更新奖励
  updateReward(rewardId, updates) {
    const rewards = this.getRewards()
    const index = rewards.findIndex(r => r.id === rewardId)
    if (index !== -1) {
      rewards[index] = { ...rewards[index], ...updates }
      this.saveRewards(rewards)
      return rewards[index]
    }
    return null
  },

  // 删除奖励
  deleteReward(rewardId) {
    const rewards = this.getRewards()
    const filteredRewards = rewards.filter(r => r.id !== rewardId)
    this.saveRewards(filteredRewards)
  },

  // 获取奖励模板
  getRewardTemplates() {
    return wx.getStorageSync('rewardTemplates') || []
  }
}

// 积分相关操作
const pointUtils = {
  // 获取总积分
  getTotalPoints() {
    return wx.getStorageSync('totalPoints') || 0
  },

  // 更新积分
  updatePoints(points) {
    const currentPoints = this.getTotalPoints()
    const newPoints = Math.max(0, currentPoints + points) // 积分不能为负数
    wx.setStorageSync('totalPoints', newPoints)
    return newPoints
  },

  // 设置积分
  setPoints(points) {
    wx.setStorageSync('totalPoints', Math.max(0, points))
  }
}

// 记录相关操作
const recordUtils = {
  // 获取所有记录
  getRecords() {
    return wx.getStorageSync('records') || []
  },

  // 保存记录
  saveRecords(records) {
    wx.setStorageSync('records', records)
  },

  // 添加记录
  addRecord(record) {
    const records = this.getRecords()
    record.id = generateId()
    record.createTime = Date.now()
    record.date = getTodayString()
    records.unshift(record) // 最新记录在前
    this.saveRecords(records)

    // 更新积分
    if (record.type === 'habit') {
      pointUtils.updatePoints(record.points)
    } else if (record.type === 'reward') {
      pointUtils.updatePoints(-record.points)
    }

    return record
  },

  // 取消记录
  cancelRecord(recordId) {
    const records = this.getRecords()
    const recordIndex = records.findIndex(r => r.id === recordId)
    if (recordIndex !== -1) {
      const record = records[recordIndex]
      
      // 恢复积分
      if (record.type === 'habit') {
        pointUtils.updatePoints(-record.points)
      } else if (record.type === 'reward') {
        pointUtils.updatePoints(record.points)
      }

      // 删除记录
      records.splice(recordIndex, 1)
      this.saveRecords(records)
      return true
    }
    return false
  },

  // 获取今天的记录
  getTodayRecords() {
    const records = this.getRecords()
    const today = getTodayString()
    return records.filter(r => r.date === today)
  }
}

module.exports = {
  formatTime,
  generateId,
  getTodayString,
  habitUtils,
  rewardUtils,
  pointUtils,
  recordUtils
}

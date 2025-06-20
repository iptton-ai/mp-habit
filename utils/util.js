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
  // 获取当前用户的所有习惯
  getHabits(userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return []

    const userData = userUtils.getUserData(currentUserId)
    return userData.habits || []
  },

  // 保存当前用户的习惯
  saveHabits(habits, userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return

    const userData = userUtils.getUserData(currentUserId)
    userData.habits = habits
    userUtils.saveUserData(currentUserId, userData)
  },

  // 添加习惯
  addHabit(habit, userId = null) {
    const habits = this.getHabits(userId)
    habit.id = generateId()
    habit.createTime = Date.now()
    habits.push(habit)
    this.saveHabits(habits, userId)
    return habit
  },

  // 更新习惯
  updateHabit(habitId, updates, userId = null) {
    const habits = this.getHabits(userId)
    const index = habits.findIndex(h => h.id === habitId)
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates }
      this.saveHabits(habits, userId)
      return habits[index]
    }
    return null
  },

  // 删除习惯
  deleteHabit(habitId, userId = null) {
    const habits = this.getHabits(userId)
    const filteredHabits = habits.filter(h => h.id !== habitId)
    this.saveHabits(filteredHabits, userId)
  },

  // 获取习惯模板
  getHabitTemplates() {
    return wx.getStorageSync('habitTemplates') || []
  }
}

// 奖励相关操作
const rewardUtils = {
  // 获取当前用户的所有奖励
  getRewards(userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return []

    const userData = userUtils.getUserData(currentUserId)
    return userData.rewards || []
  },

  // 保存当前用户的奖励
  saveRewards(rewards, userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return

    const userData = userUtils.getUserData(currentUserId)
    userData.rewards = rewards
    userUtils.saveUserData(currentUserId, userData)
  },

  // 添加奖励
  addReward(reward, userId = null) {
    const rewards = this.getRewards(userId)
    reward.id = generateId()
    reward.createTime = Date.now()
    rewards.push(reward)
    this.saveRewards(rewards, userId)
    return reward
  },

  // 更新奖励
  updateReward(rewardId, updates, userId = null) {
    const rewards = this.getRewards(userId)
    const index = rewards.findIndex(r => r.id === rewardId)
    if (index !== -1) {
      rewards[index] = { ...rewards[index], ...updates }
      this.saveRewards(rewards, userId)
      return rewards[index]
    }
    return null
  },

  // 删除奖励
  deleteReward(rewardId, userId = null) {
    const rewards = this.getRewards(userId)
    const filteredRewards = rewards.filter(r => r.id !== rewardId)
    this.saveRewards(filteredRewards, userId)
  },

  // 获取奖励模板
  getRewardTemplates() {
    return wx.getStorageSync('rewardTemplates') || []
  }
}

// 积分相关操作
const pointUtils = {
  // 获取当前用户的总积分
  getTotalPoints(userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return 0

    const userData = userUtils.getUserData(currentUserId)
    return userData.totalPoints || 0
  },

  // 更新当前用户的积分
  updatePoints(points, userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return 0

    const currentPoints = this.getTotalPoints(currentUserId)
    const newPoints = Math.max(0, currentPoints + points) // 积分不能为负数

    const userData = userUtils.getUserData(currentUserId)
    userData.totalPoints = newPoints
    userUtils.saveUserData(currentUserId, userData)

    return newPoints
  },

  // 设置当前用户的积分
  setPoints(points, userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return

    const userData = userUtils.getUserData(currentUserId)
    userData.totalPoints = Math.max(0, points)
    userUtils.saveUserData(currentUserId, userData)
  }
}

// 记录相关操作
const recordUtils = {
  // 获取当前用户的所有记录
  getRecords(userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return []

    const userData = userUtils.getUserData(currentUserId)
    return userData.records || []
  },

  // 保存当前用户的记录
  saveRecords(records, userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return

    const userData = userUtils.getUserData(currentUserId)
    userData.records = records
    userUtils.saveUserData(currentUserId, userData)
  },

  // 添加记录
  addRecord(record, userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return null

    const records = this.getRecords(currentUserId)
    record.id = generateId()
    record.createTime = Date.now()
    record.date = getTodayString()
    records.unshift(record) // 最新记录在前
    this.saveRecords(records, currentUserId)

    // 更新积分
    if (record.type === 'habit') {
      pointUtils.updatePoints(record.points, currentUserId)
    } else if (record.type === 'reward') {
      pointUtils.updatePoints(-record.points, currentUserId)
    }

    return record
  },

  // 取消记录
  cancelRecord(recordId, userId = null) {
    const currentUserId = userId || userUtils.getCurrentUserId()
    if (!currentUserId) return false

    const records = this.getRecords(currentUserId)
    const recordIndex = records.findIndex(r => r.id === recordId)
    if (recordIndex !== -1) {
      const record = records[recordIndex]

      // 恢复积分
      if (record.type === 'habit') {
        pointUtils.updatePoints(-record.points, currentUserId)
      } else if (record.type === 'reward') {
        pointUtils.updatePoints(record.points, currentUserId)
      }

      // 删除记录
      records.splice(recordIndex, 1)
      this.saveRecords(records, currentUserId)
      return true
    }
    return false
  },

  // 获取今天的记录
  getTodayRecords(userId = null) {
    const records = this.getRecords(userId)
    const today = getTodayString()
    return records.filter(r => r.date === today)
  }
}

// 用户管理相关操作
const userUtils = {
  // 获取所有用户
  getUsers() {
    return wx.getStorageSync('users') || []
  },

  // 保存用户列表
  saveUsers(users) {
    wx.setStorageSync('users', users)
  },

  // 获取当前用户ID
  getCurrentUserId() {
    return wx.getStorageSync('currentUserId') || null
  },

  // 设置当前用户
  setCurrentUser(userId) {
    wx.setStorageSync('currentUserId', userId)
  },

  // 获取当前用户信息
  getCurrentUser() {
    const currentUserId = this.getCurrentUserId()
    if (!currentUserId) return null

    const users = this.getUsers()
    return users.find(user => user.id === currentUserId) || null
  },

  // 创建新用户
  createUser(userData) {
    const users = this.getUsers()
    const newUser = {
      id: generateId(),
      name: userData.name || '新用户',
      avatar: userData.avatar || '👧',
      createTime: Date.now(),
      totalPoints: 0,
      themeKey: userData.themeKey || 'pink'
    }

    users.push(newUser)
    this.saveUsers(users)

    // 初始化用户数据
    this.initUserData(newUser.id)

    return newUser
  },

  // 更新用户信息
  updateUser(userId, updates) {
    const users = this.getUsers()
    const index = users.findIndex(user => user.id === userId)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      this.saveUsers(users)
      return users[index]
    }
    return null
  },

  // 删除用户
  deleteUser(userId) {
    const users = this.getUsers()
    const filteredUsers = users.filter(user => user.id !== userId)
    this.saveUsers(filteredUsers)

    // 清理用户数据
    this.clearUserData(userId)

    // 如果删除的是当前用户，切换到其他用户
    if (this.getCurrentUserId() === userId) {
      if (filteredUsers.length > 0) {
        this.setCurrentUser(filteredUsers[0].id)
      } else {
        wx.removeStorageSync('currentUserId')
      }
    }
  },

  // 初始化用户数据
  initUserData(userId) {
    const userDataKey = `users_data.${userId}`
    const userData = {
      habits: [],
      rewards: [],
      records: [],
      totalPoints: 0
    }
    wx.setStorageSync(userDataKey, userData)
  },

  // 清理用户数据
  clearUserData(userId) {
    const userDataKey = `users_data.${userId}`
    wx.removeStorageSync(userDataKey)
  },

  // 获取用户数据
  getUserData(userId) {
    const userDataKey = `users_data.${userId}`
    return wx.getStorageSync(userDataKey) || {
      habits: [],
      rewards: [],
      records: [],
      totalPoints: 0
    }
  },

  // 保存用户数据
  saveUserData(userId, userData) {
    const userDataKey = `users_data.${userId}`
    wx.setStorageSync(userDataKey, userData)
  },

  // 确保有默认用户
  ensureDefaultUser() {
    const users = this.getUsers()
    if (users.length === 0) {
      // 创建默认用户
      const defaultUser = this.createUser({
        name: '小公主',
        avatar: '👧',
        themeKey: 'pink'
      })
      this.setCurrentUser(defaultUser.id)
      return defaultUser
    }

    // 确保有当前用户
    if (!this.getCurrentUserId()) {
      this.setCurrentUser(users[0].id)
    }

    return this.getCurrentUser()
  },

  // 迁移旧数据到多用户格式
  migrateOldData() {
    const users = this.getUsers()
    if (users.length > 0) return // 已经是多用户格式

    // 检查是否有旧数据
    const oldHabits = wx.getStorageSync('habits')
    const oldRewards = wx.getStorageSync('rewards')
    const oldRecords = wx.getStorageSync('records')
    const oldTotalPoints = wx.getStorageSync('totalPoints')

    // 检查版本信息，确定迁移策略
    const appVersion = wx.getStorageSync('appVersion') || '1.0.0'
    const isUpgradeFrom12 = this.compareVersion(appVersion, '1.3.0') < 0

    if (oldHabits || oldRewards || oldRecords || oldTotalPoints !== null) {
      // 创建默认用户并迁移数据
      const defaultUser = this.createUser({
        name: '小公主',
        avatar: '👧',
        themeKey: 'pink'
      })

      // 完整迁移用户数据
      const userData = {
        habits: oldHabits || [],
        rewards: oldRewards || [],
        records: oldRecords || [],
        totalPoints: oldTotalPoints || 0
      }

      // 如果是从1.2版本升级，需要特别处理积分记录
      if (isUpgradeFrom12) {
        userData.records = this.migrateRecordsFromV12(oldRecords || [])
        console.log(`从版本 ${appVersion} 升级到 1.3.0，完整迁移数据`)
      }

      this.saveUserData(defaultUser.id, userData)
      this.setCurrentUser(defaultUser.id)

      // 清理旧数据
      wx.removeStorageSync('habits')
      wx.removeStorageSync('rewards')
      wx.removeStorageSync('records')
      wx.removeStorageSync('totalPoints')

      // 更新版本号
      wx.setStorageSync('appVersion', '1.3.0')

      console.log('数据迁移完成，已转换为多用户格式')
      console.log(`迁移数据统计: 习惯${userData.habits.length}个, 奖励${userData.rewards.length}个, 记录${userData.records.length}条, 积分${userData.totalPoints}`)
    } else {
      // 没有旧数据，创建默认用户
      this.ensureDefaultUser()
      // 设置版本号
      wx.setStorageSync('appVersion', '1.3.0')
    }
  },

  // 比较版本号
  compareVersion(version1, version2) {
    const v1 = version1.split('.').map(Number)
    const v2 = version2.split('.').map(Number)

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0
      const num2 = v2[i] || 0

      if (num1 < num2) return -1
      if (num1 > num2) return 1
    }
    return 0
  },

  // 从1.2版本迁移记录数据
  migrateRecordsFromV12(oldRecords) {
    return oldRecords.map(record => {
      // 确保记录包含所有必要字段
      return {
        id: record.id || generateId(),
        type: record.type || 'habit',
        name: record.name || '未知操作',
        points: record.points || 0,
        createTime: record.createTime || Date.now(),
        date: record.date || getTodayString(),
        // 保留其他可能的字段
        ...record
      }
    })
  },

  // 复制用户数据（用于同步功能）
  copyUserData(fromUserId, toUserId, dataTypes = ['habits', 'rewards']) {
    const fromData = this.getUserData(fromUserId)
    const toData = this.getUserData(toUserId)

    dataTypes.forEach(type => {
      if (fromData[type] && Array.isArray(fromData[type])) {
        // 复制数据并生成新ID
        const copiedData = fromData[type].map(item => ({
          ...item,
          id: generateId(),
          createTime: Date.now()
        }))

        // 合并到目标用户数据
        toData[type] = [...(toData[type] || []), ...copiedData]
      }
    })

    this.saveUserData(toUserId, toData)
    return toData
  },

  // 获取用户积分概览
  getUsersPointsOverview() {
    const users = this.getUsers()
    return users.map(user => {
      const userData = this.getUserData(user.id)
      return {
        ...user,
        totalPoints: userData.totalPoints || 0,
        habitsCount: (userData.habits || []).length,
        rewardsCount: (userData.rewards || []).length,
        recordsCount: (userData.records || []).length
      }
    })
  }
}

module.exports = {
  formatTime,
  generateId,
  getTodayString,
  habitUtils,
  rewardUtils,
  pointUtils,
  recordUtils,
  userUtils
}

// app.js
const { userUtils } = require('./utils/util.js')

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化数据
    this.initData()
  },

  initData() {
    // 初始化模板数据（全局共享）
    this.initTemplates()

    // 迁移旧数据并确保有默认用户
    userUtils.migrateOldData()

    // 确保有当前用户
    userUtils.ensureDefaultUser()
  },

  initTemplates() {
    // 习惯模板 - 适合7岁小女孩
    const habitTemplates = [
      { name: '🌅 早起起床', points: 5, type: 'positive' },
      { name: '🌙 按时睡觉', points: 5, type: 'positive' },
      { name: '🦷 刷牙洗脸', points: 3, type: 'positive' },
      { name: '🧸 整理玩具', points: 6, type: 'positive' },
      { name: '📚 完成作业', points: 10, type: 'positive' },
      { name: '📖 阅读故事书', points: 8, type: 'positive' },
      { name: '🏃‍♀️ 运动锻炼', points: 6, type: 'positive' },
      { name: '💕 帮助妈妈', points: 8, type: 'positive' },
      { name: '🥗 吃蔬菜', points: 5, type: 'positive' },
      { name: '🎨 画画手工', points: 6, type: 'positive' },
      { name: '🎵 练习钢琴', points: 8, type: 'positive' },
      { name: '🌸 收拾书包', points: 4, type: 'positive' },
      { name: '😤 发脾气', points: -5, type: 'negative' },
      { name: '🗑️ 乱扔垃圾', points: -3, type: 'negative' },
      { name: '📱 玩手机太久', points: -4, type: 'negative' },
      { name: '🍭 偷吃零食', points: -3, type: 'negative' }
    ]

    // 奖励模板 - 适合7岁小女孩
    const rewardTemplates = [
      { name: '🎬 看动画片30分钟', points: 15 },
      { name: '🎮 玩平板20分钟', points: 18 },
      { name: '🧸 买新玩具', points: 50 },
      { name: '🎠 去游乐场玩', points: 100 },
      { name: '🍭 买喜欢的零食', points: 25 },
      { name: '👭 和朋友玩耍', points: 60 },
      { name: '🍰 选择今天的甜点', points: 30 },
      { name: '🌙 晚睡30分钟', points: 35 },
      { name: '💅 涂指甲油', points: 20 },
      { name: '👗 选择明天的衣服', points: 15 },
      { name: '🎨 买新的画笔', points: 40 },
      { name: '📚 买新故事书', points: 45 },
      { name: '🦄 买独角兽贴纸', points: 12 },
      { name: '🌈 做手工项目', points: 35 },
      { name: '🎵 听喜欢的音乐', points: 10 },
      { name: '🍓 吃特别的水果', points: 20 }
    ]

    if (!wx.getStorageSync('habitTemplates')) {
      wx.setStorageSync('habitTemplates', habitTemplates)
    }

    if (!wx.getStorageSync('rewardTemplates')) {
      wx.setStorageSync('rewardTemplates', rewardTemplates)
    }
  },

  globalData: {
    userInfo: null
  }
})

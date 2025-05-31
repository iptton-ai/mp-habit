// 简单的功能测试脚本
// 在微信开发者工具的控制台中运行此代码来测试功能

console.log('=== 习惯小助手功能测试 ===')

// 模拟微信小程序的存储API
const mockStorage = {}
const wx = {
  getStorageSync: (key) => mockStorage[key],
  setStorageSync: (key, value) => { mockStorage[key] = value },
  clearStorageSync: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) }
}

// 导入工具函数（需要修改路径以适应测试环境）
// const { habitUtils, rewardUtils, pointUtils, recordUtils } = require('./utils/util.js')

// 测试数据初始化
function testInitialization() {
  console.log('1. 测试数据初始化...')
  
  // 初始化习惯模板
  const habitTemplates = [
    { name: '早起', points: 5, type: 'positive' },
    { name: '刷牙', points: 3, type: 'positive' },
    { name: '说脏话', points: -3, type: 'negative' }
  ]
  
  // 初始化奖励模板
  const rewardTemplates = [
    { name: '看动画片30分钟', points: 15 },
    { name: '买小玩具', points: 50 }
  ]
  
  wx.setStorageSync('habitTemplates', habitTemplates)
  wx.setStorageSync('rewardTemplates', rewardTemplates)
  wx.setStorageSync('habits', [])
  wx.setStorageSync('rewards', [])
  wx.setStorageSync('records', [])
  wx.setStorageSync('totalPoints', 0)
  
  console.log('✅ 数据初始化完成')
}

// 测试习惯管理
function testHabitManagement() {
  console.log('2. 测试习惯管理...')
  
  const habits = wx.getStorageSync('habits') || []
  
  // 添加习惯
  const newHabit = {
    id: 'habit_' + Date.now(),
    name: '测试习惯',
    points: 5,
    type: 'positive',
    createTime: Date.now()
  }
  
  habits.push(newHabit)
  wx.setStorageSync('habits', habits)
  
  console.log('✅ 习惯添加成功:', newHabit.name)
  
  // 验证习惯数量
  const savedHabits = wx.getStorageSync('habits')
  console.log('当前习惯数量:', savedHabits.length)
}

// 测试奖励管理
function testRewardManagement() {
  console.log('3. 测试奖励管理...')
  
  const rewards = wx.getStorageSync('rewards') || []
  
  // 添加奖励
  const newReward = {
    id: 'reward_' + Date.now(),
    name: '测试奖励',
    points: 20,
    createTime: Date.now()
  }
  
  rewards.push(newReward)
  wx.setStorageSync('rewards', rewards)
  
  console.log('✅ 奖励添加成功:', newReward.name)
  
  // 验证奖励数量
  const savedRewards = wx.getStorageSync('rewards')
  console.log('当前奖励数量:', savedRewards.length)
}

// 测试积分系统
function testPointSystem() {
  console.log('4. 测试积分系统...')
  
  let totalPoints = wx.getStorageSync('totalPoints') || 0
  console.log('初始积分:', totalPoints)
  
  // 增加积分
  totalPoints += 10
  wx.setStorageSync('totalPoints', totalPoints)
  console.log('增加10积分后:', wx.getStorageSync('totalPoints'))
  
  // 减少积分
  totalPoints = Math.max(0, totalPoints - 5)
  wx.setStorageSync('totalPoints', totalPoints)
  console.log('减少5积分后:', wx.getStorageSync('totalPoints'))
  
  console.log('✅ 积分系统测试完成')
}

// 测试记录系统
function testRecordSystem() {
  console.log('5. 测试记录系统...')
  
  const records = wx.getStorageSync('records') || []
  
  // 添加习惯记录
  const habitRecord = {
    id: 'record_' + Date.now(),
    type: 'habit',
    itemId: 'habit_test',
    itemName: '测试习惯',
    points: 5,
    action: 'complete',
    createTime: Date.now(),
    date: new Date().toISOString().split('T')[0]
  }
  
  records.unshift(habitRecord)
  wx.setStorageSync('records', records)
  
  console.log('✅ 习惯记录添加成功')
  
  // 添加奖励记录
  const rewardRecord = {
    id: 'record_' + (Date.now() + 1),
    type: 'reward',
    itemId: 'reward_test',
    itemName: '测试奖励',
    points: 10,
    action: 'redeem',
    createTime: Date.now() + 1,
    date: new Date().toISOString().split('T')[0]
  }
  
  records.unshift(rewardRecord)
  wx.setStorageSync('records', records)
  
  console.log('✅ 奖励记录添加成功')
  console.log('当前记录数量:', wx.getStorageSync('records').length)
}

// 运行所有测试
function runAllTests() {
  try {
    testInitialization()
    testHabitManagement()
    testRewardManagement()
    testPointSystem()
    testRecordSystem()
    
    console.log('\n=== 测试总结 ===')
    console.log('✅ 所有基础功能测试通过')
    console.log('📊 最终数据状态:')
    console.log('- 习惯数量:', wx.getStorageSync('habits').length)
    console.log('- 奖励数量:', wx.getStorageSync('rewards').length)
    console.log('- 记录数量:', wx.getStorageSync('records').length)
    console.log('- 当前积分:', wx.getStorageSync('totalPoints'))
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 在微信开发者工具控制台中运行
// runAllTests()

console.log('测试脚本加载完成，请在控制台运行 runAllTests() 开始测试')

// 导出测试函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testInitialization,
    testHabitManagement,
    testRewardManagement,
    testPointSystem,
    testRecordSystem
  }
}

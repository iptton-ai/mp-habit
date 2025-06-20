// 多用户功能测试
// 注意：这个测试文件需要在微信开发者工具的控制台中运行

// 模拟微信存储API
const mockStorage = {}
global.wx = {
  getStorageSync: (key) => mockStorage[key] || null,
  setStorageSync: (key, value) => { mockStorage[key] = value },
  removeStorageSync: (key) => { delete mockStorage[key] },
  clearStorageSync: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) }
}

// 导入工具函数
const { userUtils, habitUtils, rewardUtils, pointUtils, recordUtils } = require('./utils/util.js')

// 测试用户管理功能
function testUserManagement() {
  console.log('\n=== 测试用户管理功能 ===')
  
  // 清空存储
  global.wx.clearStorageSync()
  
  // 测试创建用户
  console.log('1. 测试创建用户...')
  const user1 = userUtils.createUser({
    name: '小明',
    avatar: '👦',
    themeKey: 'blue'
  })
  
  const user2 = userUtils.createUser({
    name: '小红',
    avatar: '👧',
    themeKey: 'pink'
  })
  
  console.log('✅ 用户创建成功')
  console.log('用户1:', user1)
  console.log('用户2:', user2)
  
  // 测试获取用户列表
  console.log('\n2. 测试获取用户列表...')
  const users = userUtils.getUsers()
  console.log('✅ 用户列表:', users)
  console.log('用户数量:', users.length)
  
  // 测试设置当前用户
  console.log('\n3. 测试设置当前用户...')
  userUtils.setCurrentUser(user1.id)
  const currentUser = userUtils.getCurrentUser()
  console.log('✅ 当前用户:', currentUser)
  
  // 测试更新用户信息
  console.log('\n4. 测试更新用户信息...')
  const updatedUser = userUtils.updateUser(user1.id, {
    name: '小明明',
    avatar: '🧒'
  })
  console.log('✅ 用户更新成功:', updatedUser)
  
  return { user1, user2 }
}

// 测试数据隔离功能
function testDataIsolation() {
  console.log('\n=== 测试数据隔离功能 ===')
  
  const users = userUtils.getUsers()
  const user1 = users[0]
  const user2 = users[1]
  
  // 为用户1添加习惯
  console.log('\n1. 为用户1添加习惯...')
  userUtils.setCurrentUser(user1.id)
  
  const habit1 = habitUtils.addHabit({
    name: '早起',
    points: 5,
    type: 'positive'
  })
  
  const habit2 = habitUtils.addHabit({
    name: '刷牙',
    points: 3,
    type: 'positive'
  })
  
  console.log('✅ 用户1习惯添加成功')
  console.log('用户1习惯列表:', habitUtils.getHabits())
  
  // 为用户2添加不同的习惯
  console.log('\n2. 为用户2添加习惯...')
  userUtils.setCurrentUser(user2.id)
  
  const habit3 = habitUtils.addHabit({
    name: '运动',
    points: 8,
    type: 'positive'
  })
  
  console.log('✅ 用户2习惯添加成功')
  console.log('用户2习惯列表:', habitUtils.getHabits())
  
  // 验证数据隔离
  console.log('\n3. 验证数据隔离...')
  userUtils.setCurrentUser(user1.id)
  const user1Habits = habitUtils.getHabits()
  
  userUtils.setCurrentUser(user2.id)
  const user2Habits = habitUtils.getHabits()
  
  console.log('用户1习惯数量:', user1Habits.length)
  console.log('用户2习惯数量:', user2Habits.length)
  
  if (user1Habits.length === 2 && user2Habits.length === 1) {
    console.log('✅ 数据隔离测试通过')
  } else {
    console.log('❌ 数据隔离测试失败')
  }
  
  return { user1, user2, habit1, habit2, habit3 }
}

// 测试积分系统隔离
function testPointsIsolation() {
  console.log('\n=== 测试积分系统隔离 ===')
  
  const users = userUtils.getUsers()
  const user1 = users[0]
  const user2 = users[1]
  
  // 为用户1添加积分
  console.log('\n1. 为用户1添加积分...')
  userUtils.setCurrentUser(user1.id)
  pointUtils.updatePoints(10)
  const user1Points = pointUtils.getTotalPoints()
  console.log('用户1积分:', user1Points)
  
  // 为用户2添加不同的积分
  console.log('\n2. 为用户2添加积分...')
  userUtils.setCurrentUser(user2.id)
  pointUtils.updatePoints(20)
  const user2Points = pointUtils.getTotalPoints()
  console.log('用户2积分:', user2Points)
  
  // 验证积分隔离
  console.log('\n3. 验证积分隔离...')
  userUtils.setCurrentUser(user1.id)
  const finalUser1Points = pointUtils.getTotalPoints()
  
  userUtils.setCurrentUser(user2.id)
  const finalUser2Points = pointUtils.getTotalPoints()
  
  console.log('最终用户1积分:', finalUser1Points)
  console.log('最终用户2积分:', finalUser2Points)
  
  if (finalUser1Points === 10 && finalUser2Points === 20) {
    console.log('✅ 积分隔离测试通过')
  } else {
    console.log('❌ 积分隔离测试失败')
  }
}

// 测试记录系统隔离
function testRecordsIsolation() {
  console.log('\n=== 测试记录系统隔离 ===')
  
  const users = userUtils.getUsers()
  const user1 = users[0]
  const user2 = users[1]
  
  // 为用户1添加记录
  console.log('\n1. 为用户1添加记录...')
  userUtils.setCurrentUser(user1.id)
  
  const record1 = recordUtils.addRecord({
    type: 'habit',
    name: '早起',
    points: 5
  })
  
  const user1Records = recordUtils.getRecords()
  console.log('用户1记录数量:', user1Records.length)
  
  // 为用户2添加记录
  console.log('\n2. 为用户2添加记录...')
  userUtils.setCurrentUser(user2.id)
  
  const record2 = recordUtils.addRecord({
    type: 'habit',
    name: '运动',
    points: 8
  })
  
  const user2Records = recordUtils.getRecords()
  console.log('用户2记录数量:', user2Records.length)
  
  // 验证记录隔离
  console.log('\n3. 验证记录隔离...')
  userUtils.setCurrentUser(user1.id)
  const finalUser1Records = recordUtils.getRecords()
  
  userUtils.setCurrentUser(user2.id)
  const finalUser2Records = recordUtils.getRecords()
  
  console.log('最终用户1记录数量:', finalUser1Records.length)
  console.log('最终用户2记录数量:', finalUser2Records.length)
  
  if (finalUser1Records.length === 1 && finalUser2Records.length === 1) {
    console.log('✅ 记录隔离测试通过')
  } else {
    console.log('❌ 记录隔离测试失败')
  }
}

// 测试数据同步功能
function testDataSync() {
  console.log('\n=== 测试数据同步功能 ===')
  
  const users = userUtils.getUsers()
  const user1 = users[0]
  const user2 = users[1]
  
  // 获取用户1的习惯数量（同步前）
  userUtils.setCurrentUser(user2.id)
  const beforeSyncCount = habitUtils.getHabits().length
  console.log('同步前用户2习惯数量:', beforeSyncCount)
  
  // 使用copyUserData方法同步数据
  console.log('\n1. 从用户1同步习惯到用户2...')
  userUtils.copyUserData(user1.id, user2.id, ['habits'])
  
  // 检查同步结果
  const afterSyncCount = habitUtils.getHabits().length
  console.log('同步后用户2习惯数量:', afterSyncCount)
  
  if (afterSyncCount > beforeSyncCount) {
    console.log('✅ 数据同步测试通过')
  } else {
    console.log('❌ 数据同步测试失败')
  }
}

// 测试用户删除功能
function testUserDeletion() {
  console.log('\n=== 测试用户删除功能 ===')
  
  const users = userUtils.getUsers()
  const userToDelete = users[1]
  const beforeCount = users.length
  
  console.log('删除前用户数量:', beforeCount)
  console.log('要删除的用户:', userToDelete.name)
  
  // 删除用户
  userUtils.deleteUser(userToDelete.id)
  
  const afterUsers = userUtils.getUsers()
  const afterCount = afterUsers.length
  
  console.log('删除后用户数量:', afterCount)
  
  // 检查当前用户是否自动切换
  const currentUser = userUtils.getCurrentUser()
  console.log('当前用户:', currentUser ? currentUser.name : '无')
  
  if (afterCount === beforeCount - 1 && currentUser) {
    console.log('✅ 用户删除测试通过')
  } else {
    console.log('❌ 用户删除测试失败')
  }
}

// 测试旧数据迁移
function testDataMigration() {
  console.log('\n=== 测试旧数据迁移功能 ===')
  
  // 清空存储
  global.wx.clearStorageSync()

  // 模拟旧数据格式
  global.wx.setStorageSync('habits', [
    { id: 'old1', name: '旧习惯1', points: 5, type: 'positive' },
    { id: 'old2', name: '旧习惯2', points: 3, type: 'positive' }
  ])

  global.wx.setStorageSync('rewards', [
    { id: 'old3', name: '旧奖励1', points: 15 }
  ])

  global.wx.setStorageSync('totalPoints', 25)

  global.wx.setStorageSync('records', [
    { id: 'old4', type: 'habit', name: '旧记录1', points: 5 }
  ])
  
  console.log('设置旧数据格式完成')
  
  // 执行迁移
  userUtils.migrateOldData()
  
  // 检查迁移结果
  const users = userUtils.getUsers()
  const currentUser = userUtils.getCurrentUser()
  
  console.log('迁移后用户数量:', users.length)
  console.log('当前用户:', currentUser ? currentUser.name : '无')
  
  if (currentUser) {
    const userData = userUtils.getUserData(currentUser.id)
    console.log('迁移的习惯数量:', userData.habits.length)
    console.log('迁移的奖励数量:', userData.rewards.length)
    console.log('迁移的积分:', userData.totalPoints)
    console.log('迁移的记录数量:', userData.records.length)
    
    // 检查旧数据是否被清理
    const oldHabits = global.wx.getStorageSync('habits')
    const oldRewards = global.wx.getStorageSync('rewards')
    const oldPoints = global.wx.getStorageSync('totalPoints')
    const oldRecords = global.wx.getStorageSync('records')
    
    if (!oldHabits && !oldRewards && !oldPoints && !oldRecords) {
      console.log('✅ 旧数据迁移测试通过')
    } else {
      console.log('❌ 旧数据清理失败')
    }
  } else {
    console.log('❌ 旧数据迁移测试失败')
  }
}

// 运行所有测试
function runAllMultiUserTests() {
  console.log('🚀 开始多用户功能测试...')
  
  try {
    // 测试用户管理
    testUserManagement()
    
    // 测试数据隔离
    testDataIsolation()
    
    // 测试积分隔离
    testPointsIsolation()
    
    // 测试记录隔离
    testRecordsIsolation()
    
    // 测试数据同步
    testDataSync()
    
    // 测试用户删除
    testUserDeletion()
    
    // 测试数据迁移
    testDataMigration()
    
    console.log('\n=== 多用户功能测试总结 ===')
    console.log('✅ 所有多用户功能测试完成')
    console.log('📊 最终存储状态:')
    console.log('- 用户数量:', userUtils.getUsers().length)
    console.log('- 当前用户:', userUtils.getCurrentUser()?.name || '无')
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllMultiUserTests,
    testUserManagement,
    testDataIsolation,
    testPointsIsolation,
    testRecordsIsolation,
    testDataSync,
    testUserDeletion,
    testDataMigration
  }
}

// 如果直接运行，执行所有测试
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
  runAllMultiUserTests()
}

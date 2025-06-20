// 版本升级测试
// 测试从1.2版本升级到1.3版本的数据迁移功能

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

// 模拟1.2版本的数据结构
function setupV12Data() {
  console.log('设置1.2版本数据...')
  
  // 清空存储
  global.wx.clearStorageSync()
  
  // 设置版本号为1.2.0
  global.wx.setStorageSync('appVersion', '1.2.0')
  
  // 模拟1.2版本的习惯数据
  const v12Habits = [
    {
      id: 'habit_1',
      name: '早起',
      points: 5,
      type: 'positive',
      createTime: 1703001600000 // 2023-12-20
    },
    {
      id: 'habit_2',
      name: '刷牙',
      points: 3,
      type: 'positive',
      createTime: 1703001700000
    },
    {
      id: 'habit_3',
      name: '熬夜',
      points: -5,
      type: 'negative',
      createTime: 1703001800000
    }
  ]
  
  // 模拟1.2版本的奖励数据
  const v12Rewards = [
    {
      id: 'reward_1',
      name: '看动画片30分钟',
      points: 15,
      createTime: 1703001900000
    },
    {
      id: 'reward_2',
      name: '买小玩具',
      points: 50,
      createTime: 1703002000000
    }
  ]
  
  // 模拟1.2版本的记录数据（包含积分获得和奖励记录）
  const v12Records = [
    {
      id: 'record_1',
      type: 'habit',
      name: '早起',
      points: 5,
      createTime: 1703088000000, // 2023-12-21
      date: '2023-12-21'
    },
    {
      id: 'record_2',
      type: 'habit',
      name: '刷牙',
      points: 3,
      createTime: 1703088300000,
      date: '2023-12-21'
    },
    {
      id: 'record_3',
      type: 'reward',
      name: '看动画片30分钟',
      points: 15,
      createTime: 1703088600000,
      date: '2023-12-21'
    },
    {
      id: 'record_4',
      type: 'habit',
      name: '早起',
      points: 5,
      createTime: 1703174400000, // 2023-12-22
      date: '2023-12-22'
    },
    {
      id: 'record_5',
      type: 'habit',
      name: '熬夜',
      points: -5,
      createTime: 1703174700000,
      date: '2023-12-22'
    }
  ]
  
  // 计算总积分（根据记录计算）
  let totalPoints = 0
  v12Records.forEach(record => {
    if (record.type === 'habit') {
      totalPoints += record.points
    } else if (record.type === 'reward') {
      totalPoints -= record.points
    }
  })
  
  // 设置1.2版本的存储数据
  global.wx.setStorageSync('habits', v12Habits)
  global.wx.setStorageSync('rewards', v12Rewards)
  global.wx.setStorageSync('records', v12Records)
  global.wx.setStorageSync('totalPoints', totalPoints)
  
  console.log('✅ 1.2版本数据设置完成')
  console.log(`- 习惯数量: ${v12Habits.length}`)
  console.log(`- 奖励数量: ${v12Rewards.length}`)
  console.log(`- 记录数量: ${v12Records.length}`)
  console.log(`- 总积分: ${totalPoints}`)
  
  return {
    habits: v12Habits,
    rewards: v12Rewards,
    records: v12Records,
    totalPoints
  }
}

// 测试版本升级迁移
function testVersionUpgrade() {
  console.log('\n=== 测试版本升级迁移 ===')
  
  // 设置1.2版本数据
  const v12Data = setupV12Data()
  
  // 执行迁移
  console.log('\n执行数据迁移...')
  userUtils.migrateOldData()
  
  // 验证迁移结果
  console.log('\n验证迁移结果...')
  
  // 检查版本号是否更新
  const newVersion = global.wx.getStorageSync('appVersion')
  console.log(`版本号: ${newVersion}`)
  
  // 检查用户是否创建
  const users = userUtils.getUsers()
  console.log(`用户数量: ${users.length}`)
  
  if (users.length === 0) {
    console.log('❌ 用户创建失败')
    return false
  }
  
  const defaultUser = users[0]
  console.log(`默认用户: ${defaultUser.name} (${defaultUser.avatar})`)
  
  // 检查用户数据迁移
  const userData = userUtils.getUserData(defaultUser.id)
  console.log(`迁移后习惯数量: ${userData.habits.length}`)
  console.log(`迁移后奖励数量: ${userData.rewards.length}`)
  console.log(`迁移后记录数量: ${userData.records.length}`)
  console.log(`迁移后总积分: ${userData.totalPoints}`)
  
  // 验证数据完整性
  let migrationSuccess = true
  
  // 验证习惯数据
  if (userData.habits.length !== v12Data.habits.length) {
    console.log('❌ 习惯数据迁移不完整')
    migrationSuccess = false
  } else {
    console.log('✅ 习惯数据迁移完整')
  }
  
  // 验证奖励数据
  if (userData.rewards.length !== v12Data.rewards.length) {
    console.log('❌ 奖励数据迁移不完整')
    migrationSuccess = false
  } else {
    console.log('✅ 奖励数据迁移完整')
  }
  
  // 验证记录数据
  if (userData.records.length !== v12Data.records.length) {
    console.log('❌ 记录数据迁移不完整')
    migrationSuccess = false
  } else {
    console.log('✅ 记录数据迁移完整')
    
    // 详细验证记录数据结构
    userData.records.forEach((record, index) => {
      const originalRecord = v12Data.records[index]
      if (record.type !== originalRecord.type || 
          record.name !== originalRecord.name || 
          record.points !== originalRecord.points) {
        console.log(`❌ 记录${index + 1}数据不匹配`)
        migrationSuccess = false
      }
    })
    
    if (migrationSuccess) {
      console.log('✅ 记录数据结构验证通过')
    }
  }
  
  // 验证积分数据
  if (userData.totalPoints !== v12Data.totalPoints) {
    console.log(`❌ 积分数据迁移错误: 期望${v12Data.totalPoints}, 实际${userData.totalPoints}`)
    migrationSuccess = false
  } else {
    console.log('✅ 积分数据迁移正确')
  }
  
  // 验证旧数据是否清理
  const oldHabits = global.wx.getStorageSync('habits')
  const oldRewards = global.wx.getStorageSync('rewards')
  const oldRecords = global.wx.getStorageSync('records')
  const oldPoints = global.wx.getStorageSync('totalPoints')
  
  if (oldHabits || oldRewards || oldRecords || oldPoints !== null) {
    console.log('❌ 旧数据清理不完整')
    migrationSuccess = false
  } else {
    console.log('✅ 旧数据清理完成')
  }
  
  return migrationSuccess
}

// 测试多次迁移（确保幂等性）
function testMultipleMigrations() {
  console.log('\n=== 测试多次迁移幂等性 ===')
  
  // 记录第一次迁移后的状态
  const users1 = userUtils.getUsers()
  const userData1 = userUtils.getUserData(users1[0].id)
  
  console.log('第一次迁移后状态记录完成')
  
  // 再次执行迁移
  console.log('执行第二次迁移...')
  userUtils.migrateOldData()
  
  // 检查状态是否保持不变
  const users2 = userUtils.getUsers()
  const userData2 = userUtils.getUserData(users2[0].id)
  
  let idempotentSuccess = true
  
  if (users2.length !== users1.length) {
    console.log('❌ 用户数量发生变化')
    idempotentSuccess = false
  }
  
  if (userData2.habits.length !== userData1.habits.length ||
      userData2.rewards.length !== userData1.rewards.length ||
      userData2.records.length !== userData1.records.length ||
      userData2.totalPoints !== userData1.totalPoints) {
    console.log('❌ 用户数据发生变化')
    idempotentSuccess = false
  }
  
  if (idempotentSuccess) {
    console.log('✅ 多次迁移幂等性测试通过')
  } else {
    console.log('❌ 多次迁移幂等性测试失败')
  }
  
  return idempotentSuccess
}

// 运行所有版本升级测试
function runVersionUpgradeTests() {
  console.log('🚀 开始版本升级测试...')
  
  try {
    // 测试版本升级迁移
    const migrationSuccess = testVersionUpgrade()
    
    // 测试多次迁移幂等性
    const idempotentSuccess = testMultipleMigrations()
    
    console.log('\n=== 版本升级测试总结 ===')
    if (migrationSuccess && idempotentSuccess) {
      console.log('✅ 所有版本升级测试通过')
      console.log('🎉 从1.2版本到1.3版本的数据迁移功能正常')
    } else {
      console.log('❌ 版本升级测试失败')
      if (!migrationSuccess) console.log('- 数据迁移测试失败')
      if (!idempotentSuccess) console.log('- 幂等性测试失败')
    }
    
    // 显示最终状态
    const finalUsers = userUtils.getUsers()
    const finalUser = finalUsers[0]
    const finalUserData = userUtils.getUserData(finalUser.id)
    
    console.log('\n📊 最终数据状态:')
    console.log(`- 应用版本: ${global.wx.getStorageSync('appVersion')}`)
    console.log(`- 用户数量: ${finalUsers.length}`)
    console.log(`- 当前用户: ${finalUser.name}`)
    console.log(`- 习惯数量: ${finalUserData.habits.length}`)
    console.log(`- 奖励数量: ${finalUserData.rewards.length}`)
    console.log(`- 记录数量: ${finalUserData.records.length}`)
    console.log(`- 总积分: ${finalUserData.totalPoints}`)
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runVersionUpgradeTests,
    testVersionUpgrade,
    testMultipleMigrations,
    setupV12Data
  }
}

// 如果直接运行，执行所有测试
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
  runVersionUpgradeTests()
}

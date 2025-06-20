// 用户主题隔离测试
// 测试不同用户的主题设置是否正确隔离

// 模拟微信存储API
const mockStorage = {}
global.wx = {
  getStorageSync: (key) => mockStorage[key] || null,
  setStorageSync: (key, value) => { mockStorage[key] = value },
  removeStorageSync: (key) => { delete mockStorage[key] },
  clearStorageSync: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) }
}

// 模拟getCurrentPages函数
global.getCurrentPages = () => [{
  route: 'pages/index/index'
}]

// 导入工具函数
const { userUtils } = require('./utils/util.js')
const { themeUtils } = require('./utils/theme.js')

// 测试用户主题隔离
function testUserThemeIsolation() {
  console.log('\n=== 测试用户主题隔离功能 ===')
  
  // 清空存储
  global.wx.clearStorageSync()
  
  // 创建多个用户，每个用户设置不同主题
  console.log('\n1. 创建多个用户并设置不同主题...')
  
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
  
  const user3 = userUtils.createUser({
    name: '小绿',
    avatar: '🧒',
    themeKey: 'green'
  })
  
  console.log('✅ 用户创建完成')
  console.log(`用户1: ${user1.name} - 主题: ${user1.themeKey}`)
  console.log(`用户2: ${user2.name} - 主题: ${user2.themeKey}`)
  console.log(`用户3: ${user3.name} - 主题: ${user3.themeKey}`)
  
  // 测试切换用户时主题是否正确切换
  console.log('\n2. 测试用户切换时主题变化...')
  
  // 切换到用户1
  userUtils.setCurrentUser(user1.id)
  const theme1 = themeUtils.getCurrentTheme()
  console.log(`切换到${user1.name}，当前主题: ${theme1.name}`)
  
  // 切换到用户2
  userUtils.setCurrentUser(user2.id)
  const theme2 = themeUtils.getCurrentTheme()
  console.log(`切换到${user2.name}，当前主题: ${theme2.name}`)
  
  // 切换到用户3
  userUtils.setCurrentUser(user3.id)
  const theme3 = themeUtils.getCurrentTheme()
  console.log(`切换到${user3.name}，当前主题: ${theme3.name}`)
  
  // 验证主题是否正确
  let themeIsolationSuccess = true
  
  if (theme1.name !== '💙 蓝色海洋') {
    console.log('❌ 用户1主题不正确')
    themeIsolationSuccess = false
  }
  
  if (theme2.name !== '💖 粉色公主') {
    console.log('❌ 用户2主题不正确')
    themeIsolationSuccess = false
  }
  
  if (theme3.name !== '💚 绿色自然') {
    console.log('❌ 用户3主题不正确')
    themeIsolationSuccess = false
  }
  
  if (themeIsolationSuccess) {
    console.log('✅ 用户主题隔离测试通过')
  }
  
  return { user1, user2, user3, themeIsolationSuccess }
}

// 测试主题设置功能
function testThemeSettings() {
  console.log('\n=== 测试主题设置功能 ===')
  
  const users = userUtils.getUsers()
  const user1 = users[0]
  const user2 = users[1]
  
  // 为用户1设置新主题
  console.log('\n1. 为用户1设置新主题...')
  userUtils.setCurrentUser(user1.id)
  const oldTheme = themeUtils.getCurrentTheme()
  console.log(`用户1原主题: ${oldTheme.name}`)
  
  // 设置为紫色主题
  themeUtils.setTheme('purple')
  const newTheme = themeUtils.getCurrentTheme()
  console.log(`用户1新主题: ${newTheme.name}`)
  
  // 检查用户数据是否更新
  const updatedUser1 = userUtils.getCurrentUser()
  console.log(`用户1存储的主题: ${updatedUser1.themeKey}`)
  
  // 切换到用户2，检查其主题是否受影响
  console.log('\n2. 检查其他用户主题是否受影响...')
  userUtils.setCurrentUser(user2.id)
  const user2Theme = themeUtils.getCurrentTheme()
  console.log(`用户2主题: ${user2Theme.name}`)
  
  // 验证主题设置是否正确
  let themeSettingSuccess = true
  
  if (updatedUser1.themeKey !== 'purple') {
    console.log('❌ 用户1主题设置失败')
    themeSettingSuccess = false
  }
  
  if (user2Theme.name !== '💖 粉色公主') {
    console.log('❌ 用户2主题受到影响')
    themeSettingSuccess = false
  }
  
  if (themeSettingSuccess) {
    console.log('✅ 主题设置功能测试通过')
  }
  
  return themeSettingSuccess
}

// 测试用户昵称显示
function testUserNameDisplay() {
  console.log('\n=== 测试用户昵称显示功能 ===')
  
  const users = userUtils.getUsers()
  
  // 测试每个用户的昵称显示
  users.forEach((user, index) => {
    userUtils.setCurrentUser(user.id)
    const displayName = themeUtils.getCurrentUserName()
    console.log(`用户${index + 1}: ${user.name} -> 显示名称: ${displayName}`)
    
    if (displayName !== user.name) {
      console.log(`❌ 用户${index + 1}昵称显示错误`)
      return false
    }
  })
  
  console.log('✅ 用户昵称显示功能测试通过')
  return true
}

// 测试主题数据完整性
function testThemeDataIntegrity() {
  console.log('\n=== 测试主题数据完整性 ===')
  
  // 获取所有主题
  const allThemes = themeUtils.getAllThemes()
  console.log(`可用主题数量: ${allThemes.length}`)
  
  // 验证每个主题的数据结构
  let dataIntegritySuccess = true
  
  allThemes.forEach(theme => {
    if (!theme.key || !theme.name || !theme.primary || !theme.background) {
      console.log(`❌ 主题"${theme.name || '未知'}"数据不完整`)
      dataIntegritySuccess = false
    }
  })
  
  // 测试不存在的主题
  const invalidTheme = themeUtils.getCurrentTheme()
  userUtils.setCurrentUser(userUtils.getUsers()[0].id)
  userUtils.updateUser(userUtils.getUsers()[0].id, { themeKey: 'invalid_theme' })
  const fallbackTheme = themeUtils.getCurrentTheme()
  
  if (fallbackTheme.name !== '💖 粉色公主') {
    console.log('❌ 无效主题回退机制失败')
    dataIntegritySuccess = false
  } else {
    console.log('✅ 无效主题回退机制正常')
  }
  
  if (dataIntegritySuccess) {
    console.log('✅ 主题数据完整性测试通过')
  }
  
  return dataIntegritySuccess
}

// 运行所有用户主题测试
function runUserThemeTests() {
  console.log('🚀 开始用户主题功能测试...')
  
  try {
    // 测试用户主题隔离
    const { themeIsolationSuccess } = testUserThemeIsolation()
    
    // 测试主题设置功能
    const themeSettingSuccess = testThemeSettings()
    
    // 测试用户昵称显示
    const userNameSuccess = testUserNameDisplay()
    
    // 测试主题数据完整性
    const dataIntegritySuccess = testThemeDataIntegrity()
    
    console.log('\n=== 用户主题功能测试总结 ===')
    if (themeIsolationSuccess && themeSettingSuccess && userNameSuccess && dataIntegritySuccess) {
      console.log('✅ 所有用户主题功能测试通过')
      console.log('🎉 用户独立主题设置功能正常')
    } else {
      console.log('❌ 用户主题功能测试失败')
      if (!themeIsolationSuccess) console.log('- 主题隔离测试失败')
      if (!themeSettingSuccess) console.log('- 主题设置测试失败')
      if (!userNameSuccess) console.log('- 用户昵称显示测试失败')
      if (!dataIntegritySuccess) console.log('- 主题数据完整性测试失败')
    }
    
    // 显示最终状态
    const finalUsers = userUtils.getUsers()
    console.log('\n📊 最终用户主题状态:')
    finalUsers.forEach((user, index) => {
      userUtils.setCurrentUser(user.id)
      const theme = themeUtils.getCurrentTheme()
      console.log(`- 用户${index + 1}: ${user.name} (${user.avatar}) - ${theme.name}`)
    })
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runUserThemeTests,
    testUserThemeIsolation,
    testThemeSettings,
    testUserNameDisplay,
    testThemeDataIntegrity
  }
}

// 如果直接运行，执行所有测试
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
  runUserThemeTests()
}

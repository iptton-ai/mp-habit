// pages/users/users.js
const { userUtils, pointUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    users: [],
    currentUserId: null,
    currentTheme: null,
    showAddDialog: false,
    newUserName: '',
    newUserAvatar: '👧',
    avatarOptions: ['👧', '👦', '🧒', '👶', '🐱', '🐶', '🐰', '🐻', '🦄', '🌟']
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
    const users = userUtils.getUsersPointsOverview()
    const currentUserId = userUtils.getCurrentUserId()
    const currentTheme = themeUtils.getCurrentTheme()
    
    this.setData({
      users,
      currentUserId,
      currentTheme
    })
  },

  // 切换用户
  switchUser(e) {
    const { userId } = e.currentTarget.dataset
    
    wx.showModal({
      title: '切换用户',
      content: '确认要切换到这个用户吗？',
      success: (res) => {
        if (res.confirm) {
          userUtils.setCurrentUser(userId)
          this.loadData()
          
          wx.showToast({
            title: '用户切换成功',
            icon: 'success'
          })
          
          // 延迟返回上一页，让用户看到切换成功的提示
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  },

  // 显示添加用户对话框
  showAddUser() {
    this.setData({
      showAddDialog: true,
      newUserName: '',
      newUserAvatar: '👧'
    })
  },

  // 隐藏添加用户对话框
  hideAddUser() {
    this.setData({
      showAddDialog: false
    })
  },

  // 输入用户名
  onNameInput(e) {
    this.setData({
      newUserName: e.detail.value
    })
  },

  // 选择头像
  selectAvatar(e) {
    const { avatar } = e.currentTarget.dataset
    this.setData({
      newUserAvatar: avatar
    })
  },

  // 确认添加用户
  confirmAddUser() {
    const { newUserName, newUserAvatar } = this.data

    if (!newUserName.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    // 为新用户随机选择一个主题
    const themeKeys = ['pink', 'blue', 'purple', 'green', 'orange']
    const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)]

    const newUser = userUtils.createUser({
      name: newUserName.trim(),
      avatar: newUserAvatar,
      themeKey: randomTheme
    })

    this.hideAddUser()
    this.loadData()

    wx.showToast({
      title: '用户创建成功',
      icon: 'success'
    })
  },

  // 编辑用户
  editUser(e) {
    const { userId } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/user-detail/user-detail?mode=edit&id=${userId}`
    })
  },

  // 删除用户
  deleteUser(e) {
    const { userId, userName } = e.currentTarget.dataset
    
    // 检查是否是最后一个用户
    if (this.data.users.length <= 1) {
      wx.showToast({
        title: '至少需要保留一个用户',
        icon: 'none'
      })
      return
    }
    
    wx.showModal({
      title: '删除用户',
      content: `确认要删除用户"${userName}"吗？这将删除该用户的所有数据，此操作不可恢复。`,
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '再次确认',
            content: '删除后无法恢复，确定要继续吗？',
            success: (res2) => {
              if (res2.confirm) {
                userUtils.deleteUser(userId)
                this.loadData()
                
                wx.showToast({
                  title: '用户已删除',
                  icon: 'success'
                })
              }
            }
          })
        }
      }
    })
  },

  // 数据同步
  goToDataSync() {
    wx.navigateTo({
      url: '/pages/data-sync/data-sync'
    })
  },

  // 查看用户详情
  viewUserDetail(e) {
    const { userId } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/user-detail/user-detail?mode=view&id=${userId}`
    })
  },

  // 分享页面
  onShareAppMessage() {
    return {
      title: '🌟 习惯小助手支持多用户管理！',
      desc: '每个人都可以有自己的习惯追踪空间，一起来养成好习惯吧！',
      path: '/pages/index/index',
      imageUrl: ''
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '🌟 习惯小助手 - 多用户习惯管理神器！',
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})

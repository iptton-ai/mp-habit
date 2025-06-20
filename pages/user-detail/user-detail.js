// pages/user-detail/user-detail.js
const { userUtils } = require('../../utils/util.js')
const { themeUtils } = require('../../utils/theme.js')

Page({
  data: {
    mode: 'view', // view, edit
    userId: null,
    user: null,
    userData: null,
    currentTheme: null,

    // 编辑表单数据
    editName: '',
    editAvatar: '👧',
    editThemeKey: 'pink',
    avatarOptions: ['👧', '👦', '🧒', '👶', '🐱', '🐶', '🐰', '🐻', '🦄', '🌟'],
    themeOptions: []
  },

  onLoad(options) {
    const { mode = 'view', id } = options
    this.setData({
      mode,
      userId: id
    })
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
    const { userId } = this.data
    if (!userId) return

    const users = userUtils.getUsers()
    const user = users.find(u => u.id === userId)
    const userData = userUtils.getUserData(userId)
    const currentTheme = themeUtils.getCurrentTheme()
    const themeOptions = themeUtils.getAllThemes()

    if (user) {
      this.setData({
        user,
        userData,
        currentTheme,
        themeOptions,
        editName: user.name,
        editAvatar: user.avatar,
        editThemeKey: user.themeKey || 'pink'
      })
    }
  },

  // 输入用户名
  onNameInput(e) {
    this.setData({
      editName: e.detail.value
    })
  },

  // 选择头像
  selectAvatar(e) {
    const { avatar } = e.currentTarget.dataset
    this.setData({
      editAvatar: avatar
    })
  },

  // 选择主题
  selectTheme(e) {
    const { themeKey } = e.currentTarget.dataset
    this.setData({
      editThemeKey: themeKey
    })
  },

  // 保存用户信息
  saveUser() {
    const { userId, editName, editAvatar, editThemeKey } = this.data

    if (!editName.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    userUtils.updateUser(userId, {
      name: editName.trim(),
      avatar: editAvatar,
      themeKey: editThemeKey
    })

    this.loadData()

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })

    // 延迟返回
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  // 重置积分
  resetPoints() {
    const { userId, user } = this.data
    
    wx.showModal({
      title: '重置积分',
      content: `确认将"${user.name}"的积分重置为0吗？此操作不可恢复。`,
      success: (res) => {
        if (res.confirm) {
          const userData = userUtils.getUserData(userId)
          userData.totalPoints = 0
          userUtils.saveUserData(userId, userData)
          
          this.loadData()
          
          wx.showToast({
            title: '积分已重置',
            icon: 'success'
          })
        }
      }
    })
  },

  // 清空用户数据
  clearUserData() {
    const { userId, user } = this.data
    
    wx.showModal({
      title: '清空数据',
      content: `确认清空"${user.name}"的所有数据吗？包括习惯、奖励、记录和积分，此操作不可恢复。`,
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '再次确认',
            content: '这将删除该用户的所有数据，确定要继续吗？',
            success: (res2) => {
              if (res2.confirm) {
                userUtils.initUserData(userId)
                this.loadData()
                
                wx.showToast({
                  title: '数据已清空',
                  icon: 'success'
                })
              }
            }
          })
        }
      }
    })
  },

  // 切换到编辑模式
  switchToEdit() {
    this.setData({
      mode: 'edit'
    })
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      mode: 'view',
      editName: this.data.user.name,
      editAvatar: this.data.user.avatar,
      editThemeKey: this.data.user.themeKey || 'pink'
    })
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  },

  // 分享页面
  onShareAppMessage() {
    const { user } = this.data
    const userName = user ? user.name : '用户'
    return {
      title: `🌟 我在用习惯小助手管理${userName}的习惯数据！`,
      desc: '支持多用户管理，每个人都可以有自己的习惯追踪空间',
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

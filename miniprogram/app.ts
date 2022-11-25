// app.ts
App<IAppOption>({
  globalData: {
    model:'', // 设备平台 iphone | android 
    navBarHeight: 0, // 导航栏高度
    statusBarHeight:0, // 状态栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuBottm: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    windowWidth:0, // 手机显示高度
    windowHeight:0, // 手机显示宽度
    pixelRatio:0, // 像素比
    shardanvasWidth:0, // 分享卡片宽度
    shardanvasHeight:0, // 分享卡片高度
  },

  onLaunch() {
    try {
      const {windowWidth,windowHeight,model,statusBarHeight,screenWidth,pixelRatio} =  wx.getSystemInfoSync()
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

      this.globalData.pixelRatio = pixelRatio
      this.globalData.statusBarHeight = statusBarHeight
      this.globalData.navBarHeight = statusBarHeight + 44;
      this.globalData.model = model.indexOf('iPhone')> -1 ? 'iphone':'android'
      this.globalData.menuRight = screenWidth - menuButtonInfo.right;
      this.globalData.menuBottm = menuButtonInfo.top - statusBarHeight;
      this.globalData.menuHeight = menuButtonInfo.height;
      this.globalData.windowHeight = windowHeight
      this.globalData.windowWidth = windowWidth
      this.globalData.shardanvasWidth = screenWidth
      this.globalData.shardanvasHeight = screenWidth * 0.8
    } catch (error) {
      console.log(error)
    }
    this.handleUpdateApp()
  },

    // 更新小程序
   handleUpdateApp() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res)
    })

    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
      // wx.showModal({
      //   title: '更新提示',
      //   content: '新版本已经准备好，是否重启应用？',
      //   success(res) {
      //     if (res.confirm) {
      //       // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      //       updateManager.applyUpdate()
      //     }
      //   }
      // })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  }
})
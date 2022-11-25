/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    model:string, // 设备平台 iphone | android 
    navBarHeight: number, // 导航栏高度
    statusBarHeight:number, // 状态栏高度
    menuRight: number, // 胶囊距右方间距（方保持左、右间距一致）
    menuBottm: number, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: number, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    windowWidth:number, // 手机显示高度
    windowHeight:number, // 手机显示宽度
    pixelRatio:number, // 设备像素比
    shardanvasWidth:number, // 分享卡片宽度
    shardanvasHeight:number, // 分享卡片高度
  },
  handleUpdateApp:()=>void
}
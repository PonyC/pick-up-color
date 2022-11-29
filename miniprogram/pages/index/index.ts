import ColorThief from '../../utils/color-thief/color-thief';
import { drawShareCard } from '../../utils/share-card'
const app:IAppOption = getApp()

Page({
  data: {
    image:null,
    hex:[],
    rgb:[],
    shareImageUrl:'',
    posterPreview:false,
    posterPreviewImageUrl:''
  },

  onLoad(){
    this.drawShare()
  },

  // 上传图片
  chooseImage() {
    wx.vibrateShort({ type: 'heavy' })
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType:['compressed'],
      success: (res) => {
        let img = res.tempFiles[0]
        // 获取图片信息
        wx.getImageInfo( {
          src: img.tempFilePath,
          success:async(res) =>{
            img = { ...img, ...res }
            const params = { canvasId: 'canvas',
            sourceImage: img,
            colorCount: 5,
            quality: 10}
            const {palette,hex,rgb} = await ColorThief.getPalette(params)
            this.setData({image:img, palette, hex ,rgb })
          }
        })
      },
      fail:(err:ChooseMediaFailCallback)=>{
        wx.showToast({title:err.message,icon:'none'})
      }
    })
  },

  // 绘制自定义卡片
  async drawShare(){
    console.log('绘制自定义卡片')
    let imageUrl:any = ''
    imageUrl = await drawShareCard({
      canvasId:'shareCard',
      ratio:app.globalData.pixelRatio,
      canvasWidth:app.globalData.shardanvasWidth,
      canvasHeight:app.globalData.shardanvasHeight,
      data:this.data.hex.length > 0 ? this.data.hex : null
    })
    this.setData({shareImageUrl:imageUrl})
  },

  // 绘制海报
  async drawPoster(){
    console.log('绘制海报')
    let imageUrl:any = ''
    imageUrl = await drawShareCard({
      canvasId:'poster',
      ratio:app.globalData.pixelRatio,
      canvasWidth:300,
      canvasHeight:300,
      data:{
        img:this.data.image,
        hex:this.data.hex,
        reg:this.data.rgb
      }
    })
    this.setData({posterPreviewImageUrl:imageUrl})
  },

  // 打开海报预览
  openPosterPreviewPopup(){
    this.drawPoster()
    this.setData({posterPreview: true});
  },

  // 海报弹窗开关状态
  onVisibleChange(e){
    console.log(e)
    this.setData({
      posterPreview: e.detail.visible,
    });
  },


  copy(e:any){
    wx.vibrateShort({ type: 'heavy' })
    const index = e.currentTarget.dataset.index
    wx.setClipboardData({
      data:`${this.data.hex[index]}，rgb(${this.data.rgb[index]})`
    })
  },

  copyAll(){
    wx.vibrateShort({ type: 'heavy' })
    const rgb = this.data.rgb.map(item=>`rgb(${item})`)
    let result:string[] = []
    rgb.forEach((item,index)=>{
      result.push(`${this.data.hex[index]}，${item}`)
    })
    
    wx.setClipboardData({
      data:result.join('\n')
    })
  },


  // 转发分享页面
  async onShareAppMessage () {
    return {
      title:'传图拾色，获取你眼中的配色',
      path: `/pages/index/index`,
      imageUrl:this.data.shareImageUrl
    }
  },

  onShareTimeline(){
    return {
      title:'传图拾色，获取你眼中的配色',
      imageUrl:'/static/logo.png'
    }
  }
})

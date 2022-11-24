// index.ts
// 获取应用实例
import ColorThief from '../../utils/color-thief/color-thief';

Page({
  data: {
    image: '',
    hex:[],
    rgb:[],
  },

  // 上传图片
  chooseImage() {
    wx.vibrateShort({ type: 'heavy' })
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        let img = res.tempFiles[0]

        // 获取图片信息
        wx.getImageInfo( {
          src: img.tempFilePath,
          success:async(res) =>{
            img = { ...img, ...res }
            const {palette,hex,rgb} = await ColorThief.getPalette({
              canvasId: 'canvas',
              sourceImage: img,
              colorCount: 5,
              quality: 5
            })
            console.log(palette,hex)
            this.setData({ image: img.tempFilePath, palette,hex,rgb })
          }
        })
      }
    })
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
    let result:array = []
    rgb.forEach((item,index)=>{
      result.push(`${this.data.hex[index]}，${item}`)
    })
    
    wx.setClipboardData({
      data:result.join('\n')
    })
  }
})

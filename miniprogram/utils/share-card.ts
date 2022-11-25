let WIDTH:number = 0
let HEIGHT:number = 0
let RATIO:number = 0

interface IdrawShareCardOptions {ratio:number,canvasWidth:number,canvasHeight:number,data:any}

export const drawShareCard = ({
  ratio,
  canvasWidth,
  canvasHeight,
  data
}:IdrawShareCardOptions) => {
  WIDTH = canvasWidth * ratio
  HEIGHT = canvasHeight  * ratio
  RATIO =  ratio
  return new Promise((reslove) => {
    wx.createSelectorQuery()
      .select('#shareCard')
      .fields({
        node: true,
        size: true,
      }).exec(async (res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        // Canvas 画布的实际绘制宽高
        canvas.width = WIDTH
        canvas.height = HEIGHT
        ctx.textBaseline = 'top'
        
        ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, WIDTH, HEIGHT)

          ctx.font = `bold ${22 * RATIO}px PingFang SC,Source Han Sans SC`
          ctx.fillStyle = '#474F59'
          ctx.fillText('没有设计师就没有图片_(:з」∠)_', 100, HEIGHT / 2 - 24 )

        // 将画布转为地址
        canvasToTempFilePath(canvas, reslove)
      })
  })
}

const darwContent = (ctx:CanvasContext,data)=>{
  // TODO:绘制主体
}

/**
  * 绘制圆角矩形
  * @param {*} x 起始点x坐标
  * @param {*} y 起始点y坐标
  * @param {*} w 矩形宽
  * @param {*} h 矩形高
  * @param {*} r 圆角半径
  * @param {*} ctx 画板上下文
  */
const darwRoundRect = ({ ctx, x, y, w, h, r }) => {
  ctx.save();
  ctx.beginPath();

  // 左上弧线
  ctx.arc(x + r, y + r, r, 1 * Math.PI, 1.5 * Math.PI);
  // 左直线
  ctx.moveTo(x, y + r);
  ctx.lineTo(x, y + h - r);
  // 左下弧线
  ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, 1 * Math.PI);
  // 下直线
  ctx.lineTo(x + r, y + h);
  ctx.lineTo(x + w - r, y + h);
  // 右下弧线
  ctx.arc(x + w - r, y + h - r, r, 0 * Math.PI, 0.5 * Math.PI);
  // 右直线
  ctx.lineTo(x + w, y + h - r);
  ctx.lineTo(x + w, y + r);
  // 右上弧线
  ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
  // 上直线
  ctx.lineTo(x + w - r, y);
  ctx.lineTo(x + r, y);

  let linearGradient = ctx.createLinearGradient(0,0,WIDTH,0); //horizontal gradient
  linearGradient.addColorStop(0  , 'rgba(152, 175, 255, 1)');
  linearGradient.addColorStop(1  , 'rgba(65, 83, 246, 1)');

  ctx.fillStyle = linearGradient;
  ctx.fill();
}

// 绘制图片
const drawImage = (canvas:Canvas, res) => {
  return new Promise((reslove, reject) => {
    const image = canvas.createImage()
    image.onload = () => {
      reslove(image)
    }
    image.src = res
  })
}

// 将画布转为地址
const canvasToTempFilePath = (canvas:Canvas, reslove:any) => {
  wx.canvasToTempFilePath({
    canvas,
    success: (res) => {
      reslove(res.tempFilePath)
    },
    fail: (res) => {
      console.log(res);
    }
  });
}
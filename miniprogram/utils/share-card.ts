let WIDTH:number = 0
let HEIGHT:number = 0
let RATIO:number = 0

interface IdrawShareCardOptions {canvasId:string,ratio:number,canvasWidth:number,canvasHeight:number,data:any}

export const drawShareCard = ({
  canvasId,
  ratio,
  canvasWidth,
  canvasHeight,
  data
}:IdrawShareCardOptions) => {
  WIDTH = canvasWidth * ratio
  HEIGHT = canvasHeight  * ratio
  RATIO =  ratio
  let id = `#${canvasId}`

  return new Promise((reslove) => {
    wx.createSelectorQuery()
      .select(id)
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

        if(canvasId === 'shareCard'){
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, WIDTH, HEIGHT)
          ctx.font = `bold ${22 * RATIO}px PingFang SC,Source Han Sans SC`
          ctx.fillStyle = '#474F59'
          ctx.fillText('没有设计师就没有图片_(:з」∠)_', 100, HEIGHT / 2 - 24 )
        }

        // 绘制海报
        if(canvasId === 'poster'){
          // 画画布
          // drawRoundRect({ ctx, x: 0, y: 0, w: WIDTH, h: HEIGHT, r:0  })
          // 画具体海报
          const img = await drawImage(canvas, data.img.tempFilePath)
          const code = await drawImage(canvas, '/static/code.png')
          const aspect = aspectFill(data.img.width,data.img.height,WIDTH,HEIGHT) // 缩放    
          ctx.drawImage(img,...aspect, 0, 0, WIDTH, HEIGHT) 
          drawRoundRect({ ctx, x: 0, y: HEIGHT/2, w: WIDTH, h: HEIGHT / 2, r:0 })
          drawPoster(ctx, data)
          const codeWidth = 2172 * 0.3
          const codeHeight = 800 * 0.3
          ctx.drawImage(
            code, //规定要使用的图像、画布或视频。
            0, 0, //开始剪切的 x 坐标位置。
            2172, 800,  //被剪切图像的高度。
            (WIDTH - codeWidth) / 2, (HEIGHT - codeHeight) - 32,//在画布上放置图像的 x 、y坐标位置。
            2172 * 0.3, 800 * 0.3  //要使用的图像的宽度、高度
          );
        }

        // 将画布转为地址
        canvasToTempFilePath(canvas, reslove)
      })
  })
}

const drawTitle = (ctx:CanvasContext)=>{
  // TODO:
  ctx.font = `bold ${24 * RATIO}px PingFang SC,Source Han Sans SC`
  ctx.fillStyle = '#000'
  ctx.fillText('拾图色', 0, 0)
}

const drawPoster = (ctx:CanvasContext,data:any)=>{
  const r = 50 // 圆半径
  const d = r * 2 // 圆半径
  const itemWidth = WIDTH / 5 // 每个item的宽度
  const startXCenter = itemWidth / 2 // 首个圆的圆心位置
  const marginTop = 16
  const startY = HEIGHT / 2 + marginTop
  data.hex.forEach((item:string,index:number) => {
    // let y = startY + (d + marginTop) * (index + 1) // 每次循环 每行的位置 = 开始位置 + 行高(直径*当前个数) + 上边距
    const currentCenter = startXCenter + itemWidth * index  // 当前圆心位置
    const currentItemStratX =  itemWidth * index // 当前块的X起始点
    ctx.beginPath(); 
    ctx.arc(currentCenter, startY, r, 0,2*Math.PI)
    ctx.fillStyle = item; 
    ctx.closePath(); 
    ctx.fill(); 
    ctx.font = `bold ${10 * RATIO}px PingFang SC,Source Han Sans SC`
    ctx.fillStyle = '#000'
    const textX = currentItemStratX + ( itemWidth - ctx.measureText(item).width) / 2 // 当前块的X起始点 + (当前块宽度 - 文字宽度) / 2
    ctx.fillText(item, textX , (startY + r + marginTop))
  });
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
const drawRoundRect = ({ ctx, x, y, w, h, r }) => {
  ctx.save()
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

  ctx.fillStyle = "#F6F6F6";
  ctx.fill();
  ctx.restore()
}

// 绘制图片
const drawImage = (canvas:Canvas, res) => {
  return new Promise((reslove, reject) => {
    const image = canvas.createImage()
    image.onload = () => {
      reslove(image)
    }
    console.log(res)
    image.src = res
  })
}

const aspectFit = (imageWidth:number, imageHeight:number, canvasWidth:number, canvasHeight:number) => {
  const imageRate = imageWidth / imageHeight
  const canvasRate = canvasWidth / canvasHeight
  let dx, dy, dw, dh
  
  if (imageRate >= canvasRate) {
    dw = canvasWidth
    dh = canvasWidth / imageRate
  } else {
    dh = canvasHeight
    dw = canvasHeight * imageRate
  }
  dx = (canvasWidth - dw) / 2
  dy = (canvasHeight - dh) / 2
  return [dx, dy, dw, dh]
}

const aspectFill = (imageWidth:number, imageHeight:number, canvasWidth:number, canvasHeight:number) => {
  const imageRate = imageWidth / imageHeight
  const canvasRate = canvasWidth / canvasHeight
  let sx, sy, sw, sh;
  if (imageRate >= canvasRate) {
    sw = imageHeight * canvasRate
    sh = imageHeight
    sx = (imageWidth - sw) / 2
    sy = 0
  } else {
    sh = imageWidth / canvasRate
    sw = imageWidth
    sx = 0
    sy = (imageHeight - sh) / 2
  }
  return [sx, sy, sw, sh]
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
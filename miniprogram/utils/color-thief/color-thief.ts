import core from './core';
const quantize = require('../quantize');

interface GetPaletteParams {
  canvasId: string,
  sourceImage: Image,
  colorCount: number,
  quality: number
}

const CanvasImage = (canvasId: string, image: Image) => {
  let canvas:Canvas = null
  let ctx:CanvasContext = null
  let width:number = 0
  let height:number = 0
  let imageData:array = []

  return new Promise((reslove)=>{
    wx.createSelectorQuery()
    .select(`#${canvasId}`)
    .fields({
      node: true,
      size: true,
    }).exec(async (res) => {
      canvas = res[0].node
      ctx = canvas.getContext('2d')
      width = canvas.width = image.width
      height = canvas.height = image.height
      const img = await drawImage(canvas, image.path)
      ctx.drawImage(img, 0, 0, width, height);
      imageData = ctx.getImageData(0, 0, width, height)
      reslove({ canvas, ctx, width, height,imageData})
    })
  })
}


// 绘制图片
const drawImage = (canvas:Canvas, res) => {
  return new Promise((reslove) => {
    const image = canvas.createImage()
    image.onload = () => {
      reslove(image)
    }
    image.src = res
  })
}


let getPalette = async ({ canvasId, sourceImage, colorCount, quality }: GetPaletteParams) => {
  const options = core.validateOptions({
    colorCount,
    quality
  });

  const image:any = await CanvasImage(canvasId, sourceImage)
  const imageData  = image.imageData;// 图片数据
  const pixelCount = image.width * image.height; // 面积
  const pixelArray = core.createPixelArray(imageData.data, pixelCount, options.quality);

  const cmap = quantize(pixelArray, options.colorCount);
  const palette = cmap? cmap.palette() : null;
  let hex:array = []

  palette.forEach((el:array) => {
    hex.push(rgbToHex(el[0],el[1],el[2]))
  });

  let rgb = palette.map((item:number)=>item.toString())

  return {
    palette,
    hex,
    rgb
  }
}


let componentToHex = (c:number)=>{
 const hex = c.toString(16)
 return hex.length === 1 ? "0" + hex : hex;
}

let rgbToHex = (r:number, g:number, b:number) =>{
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var ColorThief = { getPalette };

export default ColorThief;
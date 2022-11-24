// 该方法基于开源库（https://github.com/lokesh/color-thief），根据需求做了薛微调整

/**
 * 获取图片像素数组
 * @param imgData  - 图片的数据
 * @param pixelCount - 图片面积
 * @param quality - 每几个色码抓取一次色值 （1-10） 越小约慢，但是最准确
 */
function createPixelArray(imgData: string, pixelCount: number, quality: number) {
  const pixels: string = imgData;
  const pixelArray = [];

  for (let i: number = 0, offset: number, r: number, g: number, b: number, a: number; i < pixelCount; i = i + quality) {
    offset = i * 4;
    r = Number(pixels[offset + 0]);
    g = Number(pixels[offset + 1]);
    b = Number(pixels[offset + 2]);
    a = Number(pixels[offset + 3]);

    // If pixel is mostly opaque and not white
    if (typeof a === 'undefined' || a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        pixelArray.push([r, g, b]);
      }
    }
  }
  return pixelArray;
}

interface Options {
  colorCount: number,
  quality: number
}

// 验证参数是否传递错误
function validateOptions(options: Options) {
  let { colorCount, quality } = options;

  if (typeof colorCount === 'undefined' || !Number.isInteger(colorCount)) {
    colorCount = 10;
  } else if (colorCount === 1) {
    throw new Error('colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()');
  } else {
    colorCount = Math.max(colorCount, 2);
    colorCount = Math.min(colorCount, 20);
  }

  if (typeof quality === 'undefined' || !Number.isInteger(quality) || quality < 1) {
    quality = 10;
  }

  return {
    colorCount,
    quality
  }
}

export default {
  createPixelArray,
  validateOptions
};
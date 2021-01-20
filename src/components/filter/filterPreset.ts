/**
 * 灰度
 */
const gray = (imgData: ImageData): ImageData => {
  const { data } = imgData
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const mid = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = data[i + 1] = data[i + 2] = mid
  }

  return imgData
}

/** 黑白 */
const blackWhite = (imgData: ImageData): ImageData => {
  const { data } = imgData
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const mid = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = data[i + 1] = data[i + 2] = mid > 100 ? 255 : 0
  }

  return imgData
}

/** 反相 */
const inverse = (imgData: ImageData): ImageData => {
  const { data } = imgData
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }

  return imgData
}

/** 去色 */
const noColor = (imgData: ImageData): ImageData => {
  const { data } = imgData
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const mid = (Math.max(data[i], data[i + 1], data[i + 2]) + Math.min(data[i], data[i + 1], data[i + 2])) / 2
    data[i] = data[i + 1] = data[i + 2] = mid
  }

  return imgData
}

/** 怀旧 */
const retro = (imgData: ImageData): ImageData => {
  const { data } = imgData
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const _r = 0.393 * r + 0.769 * g + 0.189 * b
    const _g = 0.349 * r + 0.686 * g + 0.168 * b
    const _b = 0.272 * r + 0.534 * g + 0.131 * b
    data[i] = _r < 0 ? 0 : (_r > 255 ? 255 : _r)
    data[i + 1] = _g < 0 ? 0 : (_g > 255 ? 255 : _g)
    data[i + 2] = _b < 0 ? 0 : (_b > 255 ? 255 : _b)
  }

  return imgData
}

/** 连环画 */
const comic = (imgData: ImageData): ImageData => {
  const { data } = imgData
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    data[i] = Math.round(Math.abs(g - b + g + r) * r / 256)
    data[i + 1] = Math.round(Math.abs(b - g + b + r) * r / 256)
    data[i + 2] = Math.round(Math.abs(b - g + b + r) * g / 256)
  }

  return imgData
}

/** 锐化（卷积） */
const sharp = (imgData: ImageData, ctx: CanvasRenderingContext2D): ImageData => {
  const kernel = [
    -1, -1, -1,
    -1, 9, -1,
    -1, -1, -1
  ]
  const newImgData = ctx.createImageData(imgData)
  return convolutionMatrix(newImgData, imgData, kernel)
}

/** 边缘（卷积） */
const edge = (imgData: ImageData, ctx: CanvasRenderingContext2D): ImageData => {
  const kernel = [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1
  ]
  const newImgData = ctx.createImageData(imgData)
  return convolutionMatrix(newImgData, imgData, kernel)
}

/** 卷积计算 */
const convolutionMatrix = (output: ImageData, input: ImageData, kernel: number[]): ImageData => {
  let w = input.width
  let h = input.height
  let iD = input.data
  let oD = output.data
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      for (let c = 0; c < 3; c += 1) {
        let i = (y * w + x) * 4 + c
        oD[i] = kernel[0] * iD[i - w * 4 - 4] +
                kernel[1] * iD[i - w * 4] +
                kernel[2] * iD[i - w * 4 + 4] +
                kernel[3] * iD[i - 4] +
                kernel[4] * iD[i] +
                kernel[5] * iD[i + 4] +
                kernel[6] * iD[i + w * 4 - 4] +
                kernel[7] * iD[i + w * 4] +
                kernel[8] * iD[i + w * 4 + 4]
      }
      oD[(y * w + x) * 4 + 3] = 255
    }
  }
  return output
}

export default [
  gray,
  blackWhite,
  inverse,
  noColor,
  retro,
  comic,
  sharp,
  edge
]
/**
 * rgba处理 
 */
export default (imgData: ImageData, rgba: { r: number; g: number; b: number; a: number }): ImageData => {
  const { data } = imgData
  const len = data.length
  let r = 0
  let g = 0
  let b = 0
  let a = 0
  for (let i = 0; i < len; i += 4) {
    r = +rgba.r + data[i]
    g = +rgba.g + data[i + 1]
    b = +rgba.b + data[i + 2]
    a = +rgba.a + data[i + 3]
    data[i] = r < 0 ? 0 : (r > 255 ? 255 : r)
    data[i + 1] = g < 0 ? 0 : (g > 255 ? 255 : g)
    data[i + 2] = b < 0 ? 0 : (b > 255 ? 255 : b)
    data[i + 3] = a < 0 ? 0 : (a > 255 ? 255 : a)
  }
  return imgData
}
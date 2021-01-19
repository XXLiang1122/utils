/**
 * hsl处理
 */
export default (imgData: ImageData, hsl: { h: number; s: number; l: number; }): ImageData => {
  const { data } = imgData
  const len = data.length
  let _h = 0
  let _s = 0
  let _l = 0

  for (let i = 0; i < len; i += 4) {
    let [ h, s, l ] = rgbToHsl(data[i], data[i + 1], data[i + 2])
    i === 0 && console.log(h, s, l)
    h = +hsl.h + h / 100
    s = +hsl.s + s / 100
    l = +hsl.l + l / 100
    _h = h < 0 ? 0 : (h > 1 ? 1 : h)
    _s = s < 0 ? 0 : (s > 1 ? 1 : s)
    _l = l < 0 ? 0 : (l > 1 ? 1 : l)

    let [ r, g, b ] = hslToRgb(_h, _s, _l)
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }
  return imgData
}

/**
 * rgb 转 hsl
 * @param r [0, 255]
 * @param g [0, 255]
 * @param b [0, 255]
 */
function rgbToHsl (r: number, g: number, b: number): number[] {
  let _r = r / 255
  let _g = g / 255
  let _b = b / 255
  let max = Math.max(_r, _g, _b)
  let min = Math.min(_r, _g, _b)
  let h = (max + min) / 2
  let s = (max + min) / 2
  let l = (max + min) / 2

  if (max === min) {
    h = 0
    s = 0
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case _r: h = (_g - _b) / d + (_g < _b ? 6 : 0); break
      case _g: h = (_b - _r) / d + 2; break
      case _b: h = (_r - _g) / d + 4; break
    }
    h /= 6
  }
  return [Math.floor(h * 100), Math.round(s * 100), Math.round(l * 100)]
}

/**
 * hsl 转 rgb
 * @param h [0, 1]
 * @param s [0, 1]
 * @param l [0, 1]
 */
function hslToRgb (h: number, s: number, l: number): number[] {
  let r, g, b

  if (s === 0) {
    r = l
    g = l
    b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

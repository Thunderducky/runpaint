const makePoint = (x,y) => { return {x,y}}

const rgbToHex = (r, g, b) => {
  if (r > 255 || g > 255 || b > 255){
    throw new Error('Invalid color component')
  }
  const paddedHex = l => l >= 16 ? l.toString(16) : '0' + l.toString(16)
  return `#${paddedHex(r)}${paddedHex(g)}${paddedHex(b)}`
}

export {
  makePoint,
  rgbToHex
}

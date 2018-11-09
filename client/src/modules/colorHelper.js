const getLuminance = (color) => {
  //handle leading hashes
  const c = color[0] === '#' ? color.slice(1).toLowerCase() : color.toLowerCase()
  // assuming a FFFFFF style format
  // https://en.wikipedia.org/wiki/Luminance_%28relative%29
  // (0.2126*R + 0.7152*G + 0.0722*B)
  const r = parseInt(c.slice(0,2), 16)
  const g = parseInt(c.slice(2,4), 16)
  const b = parseInt(c.slice(4,6), 16)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const rgbToHex = (r, g, b) => {
  if (r > 255 || g > 255 || b > 255){
    throw new Error('Invalid color component')
  }
  const paddedHex = l => l >= 16 ? l.toString(16) : '0' + l.toString(16)
  return `#${paddedHex(r)}${paddedHex(g)}${paddedHex(b)}`
}

const isDark = (color) => getLuminance(color) < 128

export { getLuminance, isDark, rgbToHex }

const colorHelper = {
  getLuminance(color){
    const c = color.toLowerCase()
    // assuming a FFFFFF style format
    // https://en.wikipedia.org/wiki/Luminance_%28relative%29
    // (0.2126*R + 0.7152*G + 0.0722*B)
    const r = parseInt(c.slice(0,2), 16)
    const g = parseInt(c.slice(2,4), 16)
    const b = parseInt(c.slice(4,6), 16)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  },
  isDark(color){
    return this.getLuminance(color) < 128
  }
}

export default colorHelper;

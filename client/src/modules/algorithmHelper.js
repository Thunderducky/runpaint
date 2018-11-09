// intEach is INCLUSIVE
const intEach = (start, end, fn) => {
  if(start < end){
    for(let i = start; i <= end; i++){
      fn(i)
    }
  } else {
    for(let i = start; i >= end; i--){
      fn(i)
    }
  }

}
// bresenham handler
const lineRaster = (start, end) => {
  const points = []

  // determine quadrant
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y
  const signX = deltaX >= 0 ? 1 : -1
  const signY = deltaY >= 0 ? 1 : -1
  const vertical = Math.abs(deltaY) > Math.abs(deltaX)

  if(vertical){
    if(deltaX === 0){
      intEach(start.y, end.y, y => {
        points.push({x:start.x, y})
      })
    }
    else {
      let deltaError = Math.abs(deltaX/deltaY)
      let x = start.x
      let error = 0
      intEach(start.y, end.y, y => {
        points.push({x,y})
        error += deltaError
        if(error >= 0.5){
          x += signX
          error -= 1
        }
      })

    }
  } else {
    if(deltaY === 0){
      intEach(start.x, end.x, x => {
        points.push({x, y:start.y})
      })
    } else {
      let deltaError = Math.abs(deltaY/deltaX)
      let y = start.y
      let error = 0
      intEach(start.x, end.x, x => {
        points.push({x,y})
        error += deltaError
        if(error >= 0.5){
          y += signY
          error -= 1
        }
      })
    }
  }


  return points
}

export { lineRaster}

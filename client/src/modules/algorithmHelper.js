const p = (x,y) => { return {x,y}}
const lineRaster = (start, end) => {
  const points = [];
  // Is the slope greater than one,
  // or to put it another way, do we move in y faster than x
  const isSteep = Math.abs(start.y - end.y) > Math.abs(start.x - end.x);

  // if we're steep, we'll move along the y makeCanvasProcesser
  if(isSteep){
    if(start.x === end.x){
      // we are vertical, just fill in everything vertically
      if(start.y < end.y){
        for(let i = start.y; i <= end.y; i++){
          points.push(p(i, start.x));
        }
      } else {
        for(let i = end.y; i <= start.y; i++){
          points.push(p(i, start.x));
        }
      }
    }
  } else { // otherwise we'll move around the x

  }
  return points;
}

export { lineRaster}

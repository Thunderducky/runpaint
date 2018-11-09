// context is the app context, ctx is the web api specific (context)
const makeCanvasLayerRenderer = (PUBSUB, ctx) => {
  // subscribe to fillingRect and clearingRect
  // These are relatively low level, shouldn't go around these
  const sub1 = PUBSUB.subscribe('canvas.render.fillRect', ({rect, style=''}) => {
    if(style) ctx.fillStyle=style
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
  })

  const sub2 = PUBSUB.subscribe('canvas.render.clearRect', ({rect}) => {
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
  })
  const sub3 = PUBSUB.subscribe('canvas.render.clearAll', () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  })

  // TODO: Clean up this mess, maybe move it to it's own section
  const sub4 = PUBSUB.subscribe('canvas.render.smartFill', (msg) => {
    const {x,y,cellSize, color} = msg
    // HELPERS
    const rgbToHex = (r, g, b) => {
      if (r > 255 || g > 255 || b > 255){
        throw new Error('Invalid color component')
      }
      const paddedHex = l => l >= 16 ? l.toString(16) : '0' + l.toString(16)
      return `#${paddedHex(r)}${paddedHex(g)}${paddedHex(b)}`
    }
    // returns the string version, pixel point
    const getColorAtPoint = (ctx, point) => {
      const pixel = ctx.getImageData(point.x, point.y, 1, 1).data
      return {
        color: rgbToHex(pixel[0], pixel[1], pixel[2]),
        isEmpty: pixel[3] === 0  // clear alpha channel makes it 0, since we currently don't support partial alpha channels
      }
    }
    const cellsWide = ctx.canvas.width/cellSize,
      cellsHigh = ctx.canvas.height/cellSize,
      cellCount = cellsWide * cellsHigh

    const getCellInfo = (x,y) => {
      if(x < 0 || x >= cellsWide || y < 0 || y >= cellsHigh){
        return null
      }
      const { color, isEmpty} = getColorAtPoint(ctx, {x:x*cellSize, y:y * cellSize})
      return {
        x,y,color,isEmpty
      }
    }
    const cellVisitMarker = {
      _cells: new Array(cellCount).map(() => false),
      visit(x,y){
        this._cells[y*cellsWide + x] = true
      },
      isVisited(x,y){
        return this._cells[y*cellsWide + x]
      }
    }
    const paintCell = (cell, color) => {
      ctx.fillStyle=color
      ctx.fillRect(cell.x*cellSize, cell.y*cellSize, cellSize, cellSize)
    }
    const tryCell = (cell, fillEmpty, matchColor) => {
      if(!cell || cellVisitMarker.isVisited(cell.x, cell.y)){
        return false
      }

      cellVisitMarker.visit(cell.x, cell.y)
      if(cell.isEmpty === fillEmpty && cell.color === matchColor){
        return cell
      } else {
        return false
      }
    }

    const getValidNeighbors = (x,y, fillEmpty, originColor) => {
      return [
        tryCell(getCellInfo(x - 1, y), fillEmpty, originColor), // LEFT
        tryCell(getCellInfo(x, y - 1), fillEmpty, originColor), // TOP
        tryCell(getCellInfo(x + 1, y), fillEmpty, originColor), // RIGHT
        tryCell(getCellInfo(x, y + 1), fillEmpty, originColor) // DOWN
      ].filter(n => n !== false)
    }

    // Loop through everything
    const origin = getCellInfo(x, y)
    const cellQueue = [origin]
    cellVisitMarker.visit(origin.x, origin.y)
    const {color:originColor, isEmpty:fillEmpty} = origin

    // every so many iterations take a break :P
    // need to build a mesh and repaint that instead of calling
    // all of these singley

    const whileAsync = (checkFn, runFn, batchSize = 1) => {
      const intervalId = setInterval(function(){
        if(checkFn()){
          for(let i = 0; i < batchSize; i++){
            runFn();
            if(!checkFn()){
              clearInterval(intervalId);
              break;
            }
          }
        } else {
          clearInterval(intervalId);
        }
      },1)
    }

    // whileAsync(() => cellQueue.length > 0, () => {
    //   const nextCell = cellQueue.pop()
    //   paintCell(nextCell, color)
    //   const neighbors = getValidNeighbors(nextCell.x, nextCell.y, fillEmpty, originColor)
    //   neighbors.forEach(n => {
    //     cellQueue.push(n)
    //   })
    //
    // },50);



    while(cellQueue.length > 0){
      const nextCell = cellQueue.pop()
      paintCell(nextCell, color)
      const neighbors = getValidNeighbors(nextCell.x, nextCell.y, fillEmpty, originColor)
      neighbors.forEach(n => {
        cellQueue.push(n)
      })

    }

  })

  const obj = {
    _ctx: ctx,  // for debugging
    remove: () => {
      // todo, unsubscribe everything, important later for when we unsubscribe layers when we delete them
      PUBSUB.unsubscribe('canvas.render.fillRect', sub1)
      PUBSUB.unsubscribe('canvas.render.clearRect', sub2)
      PUBSUB.unsubscribe('canvas.render.clearAll', sub3)
      PUBSUB.unsubscribe('canvas.render.smartFill', sub4)
    }
  }
  return obj
}

export { makeCanvasLayerRenderer }

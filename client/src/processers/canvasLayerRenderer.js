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
  const sub3 = PUBSUB.subscribe('canvas.render.clearAll', ({rect}) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  })

  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255){
      throw'Invalid color component'
    }
    const paddedHex = l => l >= 16 ? l.toString(16) : '0' + l.toString(16)
    return `#${paddedHex(r)}${paddedHex(g)}${paddedHex(b)}`
  }
  // returns the string version, pixel point
  const getColorAt = (ctx, point) => {
    console.log(point);
    const pixel = ctx.getImageData(point.x, point.y, 1, 1).data
    console.log(pixel);
    return {
      color: rgbToHex(pixel[0], pixel[1], pixel[2]),
      isEmpty: pixel[3] === 0  // clear alpha channel makes it 0, since we currently don't support partial alpha channels
    }
  }

  // make a snapshot of the location and gets values for each
  const makeCellGridAdapter = (ctx, cellSize) => {

    const {width, height} = ctx.canvas
    const cellsHigh = height/cellSize
    const cellsWide = width/cellSize
    const grid = []
    const makeCell = (cellX,cellY) => {
      const {color, isEmpty} = getColorAt(ctx, cellX * cellSize + 1,cellY * cellSize + 1 )
      return {
        cellX,cellY,
        color,
        isEmpty,
        visited: false
      }
    }
    for(let y = 0; y < cellsHigh; y++){
      for(let x = 0; x < cellsWide; x++){
        grid.push(makeCell(x,y))
      }
    }
    return {
      _grid: grid,
      getCell(x,y){
        if(x < 0 || x >= cellsWide || y < 0 || y >= cellsHigh){
          return null
        } else {
          return grid[y*cellsWide + x]
        }
      }
    }
  }


  const sub4 = PUBSUB.subscribe('canvas.render.smartFill', ({cellSize, cellOrigin, color}) => {
    const cellsWide = ctx.canvas.width/cellSize, cellsHigh = ctx.canvas.cellSize
    const getCellInfo = (cellX,cellY) => {
      if(cellX < 0 || cellX >= cellsWide || cellY < 0 || cellY >= cellsHigh){
        return null
      } else {
        const {color, isEmpty} =  getColorAt(ctx, {x:cellX * cellSize, y:cellY * cellSize})
        return {
          x:cellX,
          y:cellY,
          color,
          isEmpty
        }
      }
    }
    // make a visited array with false
    const visited = new Array(cellsWide * cellsHigh).map(() => false)
    const isVisited = ({x,y}) => visited[y * cellsWide + x]
    const visit = ({x, y}) => visited[y * cellsWide + x] = true

    const getValidNeighbors = (cellPos, allowEmpty, testColor ) => {
      const {x,y} = cellPos
      const neighbors = [
        getCellInfo(x - 1, y),    // LEFT
        getCellInfo(x, y - 1),    // UP
        getCellInfo(x + 1, y),    // RIGHT
        getCellInfo(x, y + 1),    // DOWN
      ]
      neighbors.filter(n => {
        if(!n || isVisited(n)){
          return false
        }
        // visit any squares, even if they are not valid
        visit(n)
        if(n.isEmpty && allowEmpty){
          return true
        } else {
          return testColor === n.color
        }
      })

    }
    const origin = getCellInfo(cellOrigin.x, cellOrigin.y)
    let toVisit = [origin]
    visit(origin)
    const fillEmpty = origin.isEmpty
    const fillColor = origin.color
    setInterval(function(){
      const neighbors = getValidNeighbors(cellOrigin, fillEmpty, fillColor)
      neighbors.forEach(n => {
        toVisit.push(n)
      })
    })

    // get our starting spots info
    // if we are empty, we will only fill in empty spots
    // if we are not empty we will only fill in non-empty spots with a matching color
    // empty is defined as having 0 in the alpha channel
    // check our neighbors and mark them as visited
    // if they are valid, add them to our list of more cells to process
    // if they are not, decline the offer

  })
  // PUBSUB.publish('canvas.render.smartFill', {cellSize:20, cellOrigin:{x:1,y:1}, color:'#FFFFFF'})
  // const sub4 = PUBSUB.subscribe('canvas.render.smartFill', ({cellSize, cellOrigin, color}) => {
  //   const grid = makeCellGridAdapter(ctx, cellSize)
  //   const getValidNeighbors = (cellPlace, includeEmpty, colorMatch) => {
  //     const potentials = [
  //       grid.getCell(cellPlace.cellX - 1, cellPlace.cellY), // left
  //       grid.getCell(cellPlace.cellX, cellPlace.cellY - 1), // up
  //       grid.getCell(cellPlace.cellX + 1, cellPlace.cellY), // right
  //       grid.getCell(cellPlace.cellX, cellPlace.cellY + 1)  // down
  //     ]
  //     return potentials.filter(neighbor => {
  //       // if it's undefind or visited, reject it
  //       if(!neighbor || neighbor.visited){ return false }
  //       // if it's empty and we are allowing isEmpty
  //       else if(neighbor.isEmpty === includeEmpty){
  //         return true
  //       }
  //       // if it's the same color as us
  //       else {
  //         return (neighbor.color === colorMatch)
  //       }
  //
  //     })
  //   }
  //   const paintCell = (cellPlace, style) => {
  //     if(style){ctx.fillStyle=style}
  //     ctx.fillRect(cellPlace.cellX * cellSize, cellPlace.cellY * cellSize, cellSize, cellSize)
  //   }
  //   console.log(grid)
  //
  //   const origin = grid.getCell(cellOrigin.x, cellOrigin.y)
  //   const originColor = origin.color
  //
  //   let toVisit = [origin]
  //   const includeEmpty = origin.isEmpty;
  //
  //   let timedout = false
  //   setTimeout(() => timedout = true, 10000)
  //   const intervalId = setInterval(function(){
  //     if(toVisit.length > 0){
  //       const next = toVisit.shift()
  //       next.visited = true
  //       var neighbors = getValidNeighbors(next, includeEmpty, originColor)
  //       neighbors.forEach(n => n.visited = true)
  //       toVisit = toVisit.concat(neighbors)
  //       paintCell(next, color)
  //     } else {
  //       clearInterval(intervalId)
  //     }
  //   }, 1)
  //
  //   // we are going to build a tree on top of this
  // })

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

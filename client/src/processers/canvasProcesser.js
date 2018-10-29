const makeCanvasProcesser = (PUBSUB/*, context*/) => {
  const {subscribe:SUB, publish:PUB} = PUBSUB
  // Listen for commands and make commands for the renderer
  // This is essentially a very large relay

  // also make sure they are unique
  const calculateStops = (cellPos1, cellPos2) => {
    const stops = [cellPos1, cellPos2];
    // determine squares in between, by which
    // we mean cells

    // determine if x or y is moving faster
    // build this as a test algorithm

    return stops;
  }
  const p = (x,y) => { return {x,y} }

  // we could probably just pass these through
  // as part of the messages, so we don't have request the context
  const sub1 = SUB('canvas.command.dotpen', (msg) => {
    // this could really be done in the context
    // but that's technically not it's job I think
    const {
      prevMouseCoord, mouseWasDown,
      mouseCoord, cellSize, style
    } = msg

    const cellDimension = n => Math.floor(n/cellSize) * cellSize;
    // determine which cell we should be in
    // and the corresponding x and y coordinates
    const x = cellDimension(mouseCoord.x)
    const y = cellDimension(mouseCoord.y)

    const prevX = cellDimension(prevMouseCoord.x)
    const prevY = cellDimension(prevMouseCoord.y)
    // Need to do this for multiples if the cells are not the same
    // chart the lines we might need to hit along the way
    // make for some allowances in the movement
    // nah, make it consistent

    // We should write some unit tests for parts
    // of these
    const cellPositions = calculateStops(
      p(prevX, prevY),
      p(x,y)
    )
    cellPositions.forEach(({x,y}) => {
      PUB('canvas.render.fillRect', {
        rect:{
          x,
          y,
          height: cellSize,
          width: cellSize,
        }, style
      })
    })


  })

  const sub2 = SUB('canvas.command.eraser', (msg) => {
    // this could really be done in the context
    // but that's technically not it's job I think
    const { mouseCoord, cellSize } = msg

    // determine which cell we should be in
    // and the corresponding x and y coordinates
    const x = Math.floor(mouseCoord.x/cellSize)*cellSize
    const y = Math.floor(mouseCoord.y/cellSize)*cellSize

    PUB('canvas.render.clearRect', {
      rect:{
        x,
        y,
        height: cellSize,
        width: cellSize,
      }
    })
  })

  // we might add a message list at some point
  const obj = {
    unsubscribe:() => {
      PUBSUB.unsubscribe('canvas.command.dotpen', sub1)
      PUBSUB.unsubscribe('canvas.command.eraser', sub2)
    }
  }
  return obj
}

export { makeCanvasProcesser }

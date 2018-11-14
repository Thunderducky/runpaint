import { lineRaster } from '../modules/algorithmHelper'

const makeCanvasProcesser = (PUBSUB/*, context*/) => {
  const {subscribe:SUB, publish:PUB} = PUBSUB

  const p = (x,y) => { return {x,y} }
  const calculateStops = (cellPos1, cellPos2, cellSize) => {
    const a = p(cellPos1.x/cellSize, cellPos1.y/cellSize)
    const b = p(cellPos2.x/cellSize, cellPos2.y/cellSize)
    const stops = lineRaster(a, b)
    return stops.map(s => p(s.x*cellSize, s.y*cellSize))
  }

  // we could probably just pass these through
  // as part of the messages, so we don't have request the context
  // this might need to be moved down into the canvas for performance reasons :P
  const sub1 = SUB('command.dotpen', (msg) => {
    // this could really be done in the context
    // but that's technically not it's job I think
    const {
      prevCoord, continuing,
      coord, cellSize, style
    } = msg

    const cellDimension = n => Math.floor(n/cellSize) * cellSize
    const x = cellDimension(coord.x)
    const y = cellDimension(coord.y)

    const prevX = cellDimension(prevCoord.x)
    const prevY = cellDimension(prevCoord.y)

    const cellPositions = continuing ? calculateStops(
      p(prevX, prevY),
      p(x,y), cellSize
    ) : [p(x,y)]

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

  const sub2 = SUB('command.eraser', (msg) => {
    // this could really be done in the context
    // but that's technically not it's job I think
    const { coord, cellSize } = msg

    // determine which cell we should be in
    // and the corresponding x and y coordinates
    const x = Math.floor(coord.x/cellSize)*cellSize
    const y = Math.floor(coord.y/cellSize)*cellSize

    // TODO: process clearing rects the sameway as paint does
    PUB('canvas.render.clearRect', {
      rect:{
        x,
        y,
        height: cellSize,
        width: cellSize,
      }
    })
  })

  const sub3 = SUB('command.clear', () => {
    PUB('canvas.render.clearAll', {})
  })

  // also, we should clear this up, I thnk we're doing a lot of unnecessary
  // conversions :P
  const sub4 = SUB('command.smartFill', ({cellSize, coord, color}) => {
    const x = Math.floor(coord.x/cellSize)
    const y = Math.floor(coord.y/cellSize)
    PUB('canvas.render.smartFill', {
      x,y,
      cellSize,
      color
    })
  })

  // we might add a message list at some point
  const obj = {
    unsubscribe:() => {
      PUBSUB.unsubscribe('command.dotpen', sub1)
      PUBSUB.unsubscribe('command.eraser', sub2)
      PUBSUB.unsubscribe('command.clear', sub3)
      PUBSUB.unsubscribe('command.smartFill', sub4)
    }
  }
  return obj
}

export { makeCanvasProcesser }

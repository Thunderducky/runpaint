import { lineRaster } from '../modules/algorithmHelper'

const makeCanvasProcesser = (PUBSUB/*, context*/) => {
  const {subscribe:SUB, publish:PUB} = PUBSUB
  // Listen for commands and make commands for the renderer
  // This is essentially a very large relay

  // also make sure they are unique
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
    // determine which cell we should be in
    // and the corresponding x and y coordinates
    const x = cellDimension(coord.x)
    const y = cellDimension(coord.y)

    const prevX = cellDimension(prevCoord.x)
    const prevY = cellDimension(prevCoord.y)
    // Need to do this for multiples if the cells are not the same
    // chart the lines we might need to hit along the way
    // make for some allowances in the movement
    // nah, make it consistent

    // We should write some unit tests for parts
    // of these
    const cellPositions = continuing ? calculateStops(
      p(prevX, prevY),
      p(x,y), cellSize
    ) : [p(x,y)]
    // console.log(prevCoord, coord);
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

  const sub3 = SUB('command.clear', () => {
    PUB('canvas.render.clearAll', {})
  })

  const sub4 = SUB('command.fillAll', msg => {
    PUB('canvas.render.fillAll', msg)
  })
  // we might add a message list at some point
  const obj = {
    unsubscribe:() => {
      PUBSUB.unsubscribe('command.dotpen', sub1)
      PUBSUB.unsubscribe('command.eraser', sub2)
      PUBSUB.unsubscribe('command.clear', sub3)
      PUBSUB.unsubscribe('command.fillAll', sub4)
    }
  }
  return obj
}

export { makeCanvasProcesser }

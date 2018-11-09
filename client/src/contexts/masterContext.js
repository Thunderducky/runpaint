import SWATCHES from '../_data/swatches'

// we should build functions on top of the messaging system :/
const makeCanvasContext = (context, PUBSUB) => {
  const {publish:PUB, subscribe:SUB} = PUBSUB
  // CANVAS EVENTS
  // combine these events
  SUB('context.canvas.set.height', ({height}) => {
    context.canvas.height = height
    PUB('context.canvas.update.height', {height})
  })

  SUB('context.canvas.set.tool', ({tool}) => {
    context.canvas.tool = tool
    PUB('context.canvas.update.tool', {tool})
  })

  SUB('context.canvas.set.width', ({width}) => {
    context.canvas.width = width
    PUB('context.canvas.update.width', {width})
  })

  SUB('context.canvas.set.style', ({style}) => {
    context.canvas.style = style
    PUB('context.canvas.update.style', {style})
  })
}
const makeMouseContext = (context, PUBSUB) => {
  const {publish:PUB, subscribe:SUB} = PUBSUB
  SUB('context.mouse.down', () => {
    context.mouse.down = true
  })
  SUB('context.mouse.up', () => {
    context.mouse.down = false
  })

  // also includes `move`, `enter`, and `exit`
  SUB('context.mouse', ({coords, outside=false}, topic) => {
    // outside is a special case for a mouse up outside of the canvas
    if(!outside){
      context.mouse.coord.x = coords.x
      context.mouse.coord.y = coords.y
    }

    if(topic === 'context.mouse.exit' || outside){
      context.mouse.inside = false
    } else {
      context.mouse.inside = true
    }

    if(topic === "context.mouse.up"){
      const {
        tool, style, cellSize
      } = context.canvas
      const mouse = context.mouse
      if(mouse.inside && !mouse.down){
        if(tool === 'smartFill'){
          PUB('command.smartFill', {
            cellSize,
            coord: mouse.coord,
            color:style
          })
        }
      }
    }

    const toolTopics = ['context.mouse.down','context.mouse.move']
    if(toolTopics.includes(topic)){
      const {
        tool, style, cellSize
      } = context.canvas
      const mouse = context.mouse
      // fills only do mouse up
      if(mouse.inside && mouse.down){
        if(tool === 'dotpen'){
          PUB('command.dotpen', {
            style,
            cellSize,
            coord: mouse.coord,
            prevCoord: mouse.prevCoord,
            continuing: mouse.wasDown
          })
        } else if(tool === 'eraser'){
          PUB('command.eraser', {
            cellSize,
            coord: mouse.coord,
            prevCoord: mouse.prevCoord,
            continuing: mouse.wasDown
          })
        }
      }
    }

    PUB('context.update.activeCell',
      {
        cells:{
          x: coords.x/context.canvas.cellSize | 0,
          y: coords.y/context.canvas.cellSize | 0
        }
      })

    // update some of our internal record keepers
    context.mouse.wasDown = context.mouse.down
    context.mouse.prevCoord.x = context.mouse.coord.x
    context.mouse.prevCoord.y = context.mouse.coord.y
  })
}
const makePaletteContext = (context, PUBSUB) => {
  // PALETTE EVENTS //
  const {subscribe:SUB} = PUBSUB
  SUB('context.palette.add', ({name, color}) => {
    context.palette.push({name, color})
  })

  // TODO: Remove from palette
  SUB('context.palette.remove', () => {
    throw new Error('palette not removed, not implemented')
    //context.palette.push({name, color})
  })
}
const makeMasterContext = (PUBSUB) => {
  // we use a closure to make this work
  const context = {
    canvas: {
      width: 640,
      height: 640,
      cellSize: 20,
      tool: 'dotpen',
      style: 'white'
    },
    mouse: {
      down: false,
      wasDown: false,
      coord: {x:0,y:0},
      prevCoord: {x:0,y:0},
      inside:false // inside the canvas
    },
    palette: SWATCHES,
  }

  makeCanvasContext(context, PUBSUB)
  makeMouseContext(context, PUBSUB)
  makePaletteContext(context, PUBSUB)

  const request = () => {
    return JSON.parse(JSON.stringify(context))
  }
  return {
    request:request
  }
}

export { makeMasterContext }

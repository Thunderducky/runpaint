import SWATCHES from '../_data/swatches'

const makeMasterContext = (PUBSUB) => {
  // we use a closure to make this work
  const context = {
    canvas: {
      mouseDown: false,
      mouseWasDown: false,
      mouseCoord: {x: 0, y: 0 },
      mouseInside: true,
      // the mouse coordinate from the last draw
      prevMouseCoord: {x: 0, y: 0},


      width: 640,
      height: 640,
      cellSize: 20,

      tool: 'dotpen',
      style: 'white'
    },
    palette: SWATCHES,
  }

  const {publish:PUB, subscribe:SUB} = PUBSUB

  // CANVAS EVENTS
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

  // MOUSE EVENTS - If we detect that the user is using a mouse
  SUB('canvas.input.mouse.down', () => {
    console.log("DOWN DOWN DOWN DOWN");
    context.canvas.mouseDown = true
  })
  SUB('canvas.input.mouse.up', () => {
    context.canvas.mouseDown = false
  })

  // also includes `move`, `enter`, and `exit`
  SUB('canvas.input.mouse', ({coords, outside=false}, topic) => {
    // outside is a special case for a mouse up outside of the canvas
    if(!outside){
      context.canvas.mouseCoord.x = coords.x
      context.canvas.mouseCoord.y = coords.y
    }

    if(topic === 'canvas.input.mouse.exit' || outside){
      context.canvas.mouseInside = false
    } else {
      context.canvas.mouseInside = true
    }

    const toolTopics = ['canvas.input.mouse.down','canvas.input.mouse.move']
    if(toolTopics.includes(topic)){
      const {
        mouseInside, mouseDown, mouseWasDown, mouseCoord,
        tool, style, cellSize,
        prevMouseCoord
      } = context.canvas

      if(mouseInside && mouseDown){
        if(tool === 'dotpen'){
          PUB('canvas.command.dotpen', {
            style,
            mouseCoord,
            cellSize,
            prevMouseCoord,
            mouseWasDown
          })
        } else if(tool === 'eraser'){
          PUB('canvas.command.eraser', {
            mouseCoord,
            cellSize,
            prevMouseCoord,
            mouseWasDown
          })
        }
      }
    }

    // update our position after all of that
    PUB('canvas.update.input.mouse',
      {
        cells:{
          x: coords.x/context.canvas.cellSize | 0,
          y: coords.y/context.canvas.cellSize | 0
        }
      })

    // update some of our internal record keepers
    context.canvas.mouseWasDown = context.canvas.mouseDown;
    context.canvas.prevMouseCoord = context.canvas.mouseCoord
  })

  // PALETTE EVENTS //
  SUB('palette.set.add', ({name, color}) => {
    context.palette.push({name, color})
  })

  SUB('palette.set.remove', ({ index }) => {
    //context.palette.push({name, color})
  })

  const request = () => {
    return JSON.parse(JSON.stringify(context))
  }
  return {
    request:request
  }
}

export { makeMasterContext }

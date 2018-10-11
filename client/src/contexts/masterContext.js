const makeMasterContext = (PUBSUB) => {
  // we use a closure to make this work
  const context = {
    canvas: {
      cellSize: 1,
      mouseDown: false,
      mouseCoord: {x: 0, y: 0 },
      mouseInside: true,

      width: 640,
      height: 640,
      tool: 'dotpen'
    }
  }

  const updateMouseCoords = (coords) => {
    context.canvas.mouseCoord.x = coords.x
    context.canvas.mouseCoord.y = coords.y
  }

  const {publish:PUB, subscribe:SUB} = PUBSUB

  SUB('context.canvas.set.height', ({height}) => {
    context.canvas.height = height
    PUB('context.canvas.update.height', {height})
  })

  SUB('context.canvas.set.width', ({width}) => {
    context.canvas.width = width
    PUB('context.canvas.update.width', {width})
  })

  SUB('context.canvas.set.height', ({height}) => {
    context.canvas.height = height
    PUB('context.canvas.update.height', {height})
  })

  SUB('context.canvas.set.height', ({height}) => {
    context.canvas.height = height
    PUB('context.canvas.update.height', {height})
  })

  // These pieces should probably be broken up more, but oh well
  SUB('canvas.input.mouse.down', () => {
    // We'll publish coords when we need to
    // we want to update our context first so we'll call commands second
    context.canvas.mouseDown = true
    context.canvas.mouseInside = true
  })

  SUB('canvas.input.mouse.move', () => {
    context.canvas.mouseInside = true
  })

  SUB('canvas.input.mouse.up', () => {
    context.canvas.mouseInside = true
    context.canvas.mouseDown = false
  })

  SUB('canvas.input.mouse.enter', () => {
    context.canvas.mouseInside = true
  })

  SUB('canvas.input.mouse.exit', () => {
    context.canvas.mouseInside = false
  })

  SUB('canvas.input.mouse', ({coords}, topic) => {
    updateMouseCoords(coords)
    const paint_topics = ['canvas.input.mouse.down','canvas.input.mouse.move']
    if(paint_topics.includes(topic)){
      const {mouseInside, mouseDown, tool} = context.canvas
      if(mouseInside && mouseDown){
        if(tool === 'dotpen'){
          PUB('canvas.command.dotpen', {})
        }
      }
    }
  })


  // tied to implementation, but whatever
  // the important thing is we are not giving them
  // direct copies of this property
  const request = () => {
    // Returns copy that doesn't mutate
    return JSON.parse(JSON.stringify(context))
  }
  return {
    request:request
  }
}

export { makeMasterContext }

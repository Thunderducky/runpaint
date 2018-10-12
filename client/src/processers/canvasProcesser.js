const makeCanvasProcesser = (PUBSUB/*, context*/) => {
  const {subscribe:SUB, publish:PUB} = PUBSUB
  // Listen for commands and make commands for the renderer
  // This is essentially a very large relay

  // we could probably just pass these through
  // as part of the messages, so we don't have request the context
  const sub1 = SUB('canvas.command.dotpen', (msg) => {
    // this could really be done in the context
    // but that's technically not it's job I think
    const { mouseCoord, cellSize, style } = msg

    // determine which cell we should be in
    // and the corresponding x and y coordinates
    const x = Math.floor(mouseCoord.x/cellSize)*cellSize
    const y = Math.floor(mouseCoord.y/cellSize)*cellSize

    PUB('canvas.render.fillRect', {
      rect:{
        x,
        y,
        height: cellSize,
        width: cellSize,
      }, style
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

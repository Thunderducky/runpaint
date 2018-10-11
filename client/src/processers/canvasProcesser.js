const makeCanvasProcesser = (PUBSUB, context) => {
  const {subscribe:SUB, publish:PUB} = PUBSUB
  // Listen for commands and make commands for the renderer
  // This is essentially a very large relay

  SUB('canvas.command.dotpen', () => {
    const {mouseCoord:coords, cellSize } = context.request().canvas
    // we need to adjust for the border size at some point
    //console.log("COMMAND", coords)
    PUB('canvas.render.fillRect', {
      rect:{
        x:coords.x,
        y:coords.y,
        height: cellSize,
        width: cellSize,
      }, style: 'white'
    })
  })

  // Initial, just draw on the pixel we tell it to, but we'll just assume we are working with
  // cellSize = 1
  // PUBSUB.subscribe('canvas.input.mouse.down', ({coords}) => {
  //   console.log(`mouse down! (${coords.x}, ${coords.y})`)
  //   PUBSUB.publish('canvas.render.fillRect', {
  //     rect:{
  //       x:coords.x,
  //       y:coords.y,
  //       height: 1,
  //       width: 1,
  //     }, style: 'white'
  //   })
  // })
  // PUBSUB.subscribe('canvas.input.mouse.move', ({coords}) => {
  //   const isMouseDown = context.request().mouseDown
  //   console.log(`mouse move! (${coords.x}, ${coords.y})`)
  //   if(isMouseDown){
  //     PUBSUB.publish('canvas.render.fillRect', {
  //       rect:{
  //         x:coords.x,
  //         y:coords.y,
  //         height: 1,
  //         width: 1,
  //       }, style: 'white'
  //     })
  //   }
  // })
  const obj = {}
  return obj
}

export { makeCanvasProcesser }

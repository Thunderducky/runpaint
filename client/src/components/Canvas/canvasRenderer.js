// TODO: ALLOW TOPIC INJECTION
const addCanvasRenderSubscriber = (ctx, PUBSUB) => {
  PUBSUB.subscribe('canvas.renderer.fillRect', function(msg){
    const { rect, style } = msg
    ctx.fillStyle = style || ctx.fillStyle
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
  })
  PUBSUB.subscribe('canvas.renderer.clearRect', function(msg){
    const { rect } = msg
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
  })
}

export { addCanvasRenderSubscriber }

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

  // a way to debug or look at if we need to
  const obj = {
    _ctx: ctx,
    remove: () => {
      // todo, unsubscribe everything, important later for when we unsubscribe layers when we delete them
      PUBSUB.unsubscribe('canvas.render.fillRect', sub1)
      PUBSUB.unsubscribe('canvas.render.clearRect', sub2)
    }
  }
  return obj
}

export { makeCanvasLayerRenderer }

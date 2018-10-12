// Listens to pubs and subs and affects everything based off of that
// this is sort of our business logic
const makeCanvasStateManager = (PUBSUB) => {
  // SUBSCRIBE TO THOSE EVENTS AND PUBLISH OTHERS
  const state = {
    inBounds: false,
    mouseDown: false
  }
  PUBSUB.subscribe('canvas.mouse.up',() => {
    state.mouseDown = false
  })
  PUBSUB.subscribe('canvas.mouse.move', msg => {
    if(state.inBounds && state.mouseDown){
      PUBSUB.publish('canvas.command.paint',msg)
    }
  })
  PUBSUB.subscribe('canvas.mouse.down', msg => {
    state.mouseDown = true
    if(state.inBounds){
      PUBSUB.publish('canvas.command.paint',msg)
    }
  })
  PUBSUB.subscribe('canvas.mouse.enter', () => {
    state.inBounds = true
  })
  PUBSUB.subscribe('canvas.mouse.exit', () => {
    state.inBounds = false
  })
  return state
}

export { makeCanvasStateManager }

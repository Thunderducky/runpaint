import { makeUndoSystem }  from '../../system/undoSystem'

// HELPR FUNCTIONS
const rect = (x,y,width,height) => {
  return {
    x,y,width,height
  }
}
const sameRect = (a,b) => {
  return a.x === b.x && a.y === b.y
    && a.width === b.width
    && a.height === b.height
}

const undoableTopics = ['canvas.renderer.fillRect', 'canvas.renderer.clearRect']

const filter = (message, lastMessage) => {
  return lastMessage === false
    || message.topic !== lastMessage.topic
    || !sameRect(message.msg.rect, lastMessage.msg.rect)
}

const addCanvasHistoryListener = PUBSUB => {
  // we'll need to send this over to the canvas system a little better,
  // but we'll get there
  const clearCanvas = () => {
    PUBSUB.publish('canvas.renderer.clearRect', {rect: rect(0,0,640,640)})
  }

  const obj = {
    _undoSystem:makeUndoSystem(PUBSUB, undoableTopics, clearCanvas, filter)
  }
  PUBSUB.subscribe('canvas.command.paint', () => {
    obj._undoSystem.resetHead()
  })

  PUBSUB.subscribe('canvas.history.undo', () => {
    obj._undoSystem.undo()
  })
  PUBSUB.subscribe('canvas.history.redo', () => {
    obj._undoSystem.redo()
  })
  // shouldn't REALLY Use this thing, but hey, for testing I guess
  return obj
}

export { addCanvasHistoryListener }

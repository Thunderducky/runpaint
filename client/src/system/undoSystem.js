import {makePubsubRecorder} from '../modules/pubsubRecorder'

const isSameCell = (p1, p2, cellSize) => {
  // CELL DIMENSION
  const dim = x => (x - x % cellSize)/cellSize

  // Optimizations exist...
  return (dim(p1.x) === dim(p2.x) && dim(p1.y) === dim(p2.y))
}

const isDuplicateDotPens = (msg, prevMsg) => {
  return isSameCell(msg.coord, prevMsg.coord, msg.cellSize)
}

const undoableEvents = [
  'command.dotpen',
  'command.clear',
  'command.smartFill'
]

// THIS IS NOT GENERAL PURPOSE, THIS IS OUR SPECIFIC UNDO SYSTEM WITH ALL THE GROSSNESS INSIDE
const makeUndoSystem = (PUBSUB) => {
  // HELPER FOR THE UNDO SYSTEM
  const sealUndoStatus = () => {
    if(obj._recorder.recording && obj._undoIndex !== 0){
      obj._recorder.rollback(obj._undoIndex)
      obj._undoIndex = 0
    }
  }

  // we need to register this first so that the we intercept before the recorder does
  undoableEvents.forEach(e => {
    // we should subscribe to these events first
    PUBSUB.subscribe(e, sealUndoStatus)
  })

  const obj = {
    _undoIndex: 0,
    _recorder: makePubsubRecorder(PUBSUB, undoableEvents, (current, prev) => {
      if(!prev){
        return true
      }
      if(prev.topic === 'command.dotpen' && current.topic === 'command.dotpen'){
        return !isDuplicateDotPens(current.msg, prev.msg)
      }
      return true
    }).listen(),
    get history(){
      return this._recorder.messages
    },
  }

  obj.undo = () => {
    obj._undoIndex++
    // If nothing more can be undone
    if(obj._undoIndex > obj.history.length){
      obj._undoIndex = obj.history.length
      return
    }

    const lastIndex = obj.history.length - obj._undoIndex - 1
    obj._recorder.deafen()

    PUBSUB.publish('command.clear', {})
    obj._recorder.replay(0, lastIndex)

    obj._recorder.listen()
  }
  obj.redo = () => {
    obj._undoIndex--
    if(obj._undoIndex < 0) {
      obj._undoIndex = 0
      return
    }

    const lastIndex = obj.history.length - obj._undoIndex - 1
    obj._recorder.deafen()

    PUBSUB.publish('command.clear', {})
    obj._recorder.replay(0, lastIndex)

    obj._recorder.listen()
  }

  return obj
}

export { makeUndoSystem }

import {makePubsubRecorder} from '../modules/pubsubRecorder'

const _save = (name, data) => localStorage.setItem(name, JSON.stringify(data))
const _load = name => JSON.parse(localStorage.getItem(name))

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
  const sealUndoStatus = (msg) => {
    console.log('make sure we preserve our sealing order')
    if(obj._recorder.recording && obj._undoIndex !== 0){
      console.log('seal')
      obj._recorder.rollback(obj._undoIndex)
      obj._undoIndex = 0
      console.log(obj._undoIndex)
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
    if(obj._undoIndex > obj.history.length){
      obj._undoIndex = obj.history.length
      return
    }
    console.log(obj._undoIndex)

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
    console.log(obj._undoIndex)

    const lastIndex = obj.history.length - obj._undoIndex - 1
    obj._recorder.deafen()

    PUBSUB.publish('command.clear', {})
    obj._recorder.replay(0, lastIndex)

    obj._recorder.listen()
  }

  obj.debugSave = function(name){
    _save('undoSystem-' + name, obj._recorder._messages)
  }
  obj.debugLoad = function(name){
    obj._recorder._messages = _load('undoSystem-' + name)
  }

  return obj
}

export { makeUndoSystem }

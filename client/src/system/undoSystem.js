import {makePubsubRecorder} from '../modules/pubsubRecorder'
// the undo system is an enhancement of the replay system
// NOTE: filters can be blank
// NOTE: onReset must be set blank explicitly
const makeUndoSystem = (PUBSUB, topics, onReset, filter) => {
  if(typeof onReset !== 'function'){
    throw new Error('undo systems require a onReset function, even if it is blank')
  }
  if(!topics){
    throw new Error('undo systems require topics to subscribe to')
  }
  if(!Array.isArray(topics)){
    throw new Error('undo systems topics must be in an array')
  }
  const recorder = makePubsubRecorder(PUBSUB, topics, filter).listen()
  const obj = {
    _onReset: onReset,
    _undoIndex: 0,
    _recorder : recorder,
    undo(){
      this._undoIndex++

      const count = this._recorder.count()
      const lastIndex = count - 1

      if(count < this._undoIndex){
        this._undoIndex-- // undo our move, we are done
      } else {
        this._onReset()
        this._recorder.replay(0, lastIndex - this._undoIndex)
      }
    },
    // rollback rolls back to the current undoIndex
    resetHead(){
      this._recorder.rollback(this._undoIndex)
    },
    redo(){
      this._undoIndex--

      if(this._undoIndex < 0){
        this._undoIndex = 0
      }

      const count = this._recorder.count()
      const lastIndex = count - 1
      const actionIndex = lastIndex - this._undoIndex

      if(this._undoIndex > 0){
        this._recorder.replay(actionIndex, actionIndex)
      }
    }
  }
  return obj
}
export {makeUndoSystem}

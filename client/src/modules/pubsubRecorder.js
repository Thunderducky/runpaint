const DEFAULT_FILTER = (lastMsg, msg) => true // eslint-disable-line no-unused-vars

const last = arr => arr[arr.length - 1]

const makePubsubRecorder = (PUBSUB, topics, filter = DEFAULT_FILTER) => {
  const obj = {
    _messages: [],  // private fields,s but useful for debugging
    _topics: topics,
    recording: false,

    listen(){
      this.recording = true
      return this
    },
    deafen(){
      this.recording = false
      return this
    },
    // replays stop any records
    replay(startIndex = 0, lastIndex = this._messages.length - 1){
      this.recording = false
      this._messages.slice(startIndex, lastIndex + 1).forEach(
        p => PUBSUB.publish(p.topic, p.msg)
      )
      this.recording = true
      return this
    },
    rollback(stepCount){
      // OPTIMIZE: for large amounts of rollback
      for(let i = 0; i <stepCount; i++){
        this._messages.pop()
      }
    },
    count(){
      return this._messages.length
    },
    clear(){
      this._messages.length = 0
      return this
    }
  }

  // TODO, add ability to unsubscribe
  // add multi subscribe?
  // hardcoded topics
  obj._topics.forEach(topic => {
    PUBSUB.subscribe(topic, (msg, _topic) => {
      if(obj.recording){
        if(filter({msg:msg, topic: _topic}, last(obj._messages) || false)) {
          obj._messages.push({
            msg: msg,
            topic: _topic
          })
        }
      }
    })
  })

  return obj
}

export { makePubsubRecorder }

const makePubsubRecorder = (PUBSUB, topic) => {
  const obj = {
    _messages: [],  // private fields, but useful for debugging
    _topic: topic,
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
    count(){
      return this._messages.length
    },
    clear(){
      this._messages.length = 0
      return this
    }
  }
  // TODO, add ability to unsubscribe
  PUBSUB.subscribe(topic, (msg, _topic) => {
    if(obj.recording){
      obj._messages.push({
        msg: msg,
        topic: _topic
      })
    }
  })
  return obj
}

export { makePubsubRecorder }

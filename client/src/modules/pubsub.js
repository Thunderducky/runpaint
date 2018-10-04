let _id = 1
const genId = () => _id++

// TODO: Add unsubscribing

const makePubSub = () => {
  const obj = {
    topics: {}
  }

  obj.publish = (_topic, _msg) => {
    // this could have side effects, like accidentally
    // freezing things, but most importantly
    // it keeps subscribers from accidentally changing things
    // I'd rather have objects having to make copies
    // than worry about accidentally changing properties
    const msg = Object.freeze(_msg)
    const topicSets = _topic.split('.')
    while(topicSets.length > 0){
      const topic = topicSets.join('.')
      if(obj.topics[topic]){
        obj.topics[topic].forEach(sub => sub(msg, topic))
      }
      topicSets.pop()
    }

  }
  obj.subscribe = (topic, fnListener) => {
    if((typeof fnListener) !== 'function'){
      throw Error('fnListener must be a function')
    }
    // don't do it this way
    const id = genId()
    const wrapper = (msg, topic) => { fnListener(msg, topic)}
    obj.topics[topic] = obj.topics[topic] || []
    wrapper._id = id // mostly for debugging purposes
    obj.topics[topic].push(wrapper)
    return id
  }
  obj.subscriberCount = (topic) => {
    const subs = obj.topics[topic]
    if(!Array.isArray(subs)){
      return 0
    } else {
      return subs.length
    }
  }
  obj.unsubscribe = (topic, fnId) => {
    if(obj.subscriberCount(topic) === 0){
      throw Error('no subscribers on this topic')
    }
    obj.topics[topic] = obj.topics[topic].filter(fn => fn._id != fnId)
  }

  return obj
}

const PUBSUB = makePubSub()

export { PUBSUB } // This is the instantiated version
export { makePubSub } // This is the version for unit tests

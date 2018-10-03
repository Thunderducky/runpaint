let _id = 1
const genId = () => _id++

// TODO: Add unsubscribing

const makePubSub = () => {
  const obj = {
    topics: {}
  }

  obj.publish = (topic, _msg) => {
    // this could have side effects, like accidentally
    // freezing things, but most importantly
    // it keeps subscribers from accidentally changing things
    // I'd rather have objects having to make copies
    // than worry about accidentally changing properties
    const msg = Object.freeze(_msg)
    if(obj.topics[topic]){
      obj.topics[topic].forEach(sub => sub(msg, topic))
    }
  }
  obj.subscribe = (topic, fnListener) => {
    if((typeof fnListener) !== 'function'){
      throw Error('fnListener must be a function')
    }

    obj.topics[topic] = obj.topics[topic] || []
    fnListener._id = genId() // mostly for debugging purposes
    obj.topics[topic].push(fnListener)
  }

  return obj
}

const PUBSUB = makePubSub()

export { PUBSUB } // This is the instantiated version
export { makePubSub } // This is the version for unit tests

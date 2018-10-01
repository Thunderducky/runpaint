let _id = 1
const genId = () => _id++

const makePubSub = () => {
  const obj = {
    topics: {}
  }


  obj.publish = (topic, msg) => {
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

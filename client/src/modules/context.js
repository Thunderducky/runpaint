const makeContext = () => {
  const obj = {
    providers: {}
  }

  // providerFns should always return Promises
  obj.registerProvider = (name, providerFn) => {
    if(obj.providers[name]){
      throw Error('Provider already exists with that name')
    } else if(typeof providerFn !== 'function'){
      throw Error('providerFn must be a function')
    }else {
      obj.providers[name] = providerFn
    }
  }
  obj.unregisterProvider = (name) => {
    obj.providers[name] = undefined
  }
  obj.request = (name, ...args) => {
    if(!obj.providers[name]){
      throw Error(`Provider with name: '${name}' does not exist!`)
    }
    return obj.providers[name].apply(args)
  }

  return obj
}

export { makeContext }

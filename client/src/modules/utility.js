const times = (fn, count) => {
  for(var i = 0; i < count; i++){
    fn()
  }
}
const last = arr => arr[arr.length-1]

export { times, last }

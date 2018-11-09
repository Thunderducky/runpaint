import { lineRaster } from './algorithmHelper'

const p = (x,y) => { return {x,y}}

describe('testing algorithm helper', function(){
  test('simplest test', function(){
    expect(lineRaster(p(0,0), p(3,3)).length > 2).toBe(true)
  })
})

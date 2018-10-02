import { addCanvasRenderSubscriber } from './canvasRenderer'
import { makePubSub } from './pubsub'

describe('Testing Pubsub', () => {
  test('it works at all', () => {
    expect( () => {
      addCanvasRenderSubscriber({}, makePubSub())
    }).not.toThrow()
  })
  test('we can ask to draw a rectangle', () => {
    expect( () => {
      expect.assertions(4)
      const _PUBSUB = makePubSub()
      const fakeRect = {
        x:Math.random() * 15,
        y: Math.random() * 15,
        width:30,
        height:30
      }
      const fakeCtx = {
        fillStyle: '',
        fillRect(x,y, width, height){
          expect(x).toBe(fakeRect.x)
          expect(y).toBe(fakeRect.y)
          expect(width).toBe(fakeRect.width)
          expect(height).toBe(fakeRect.height)
        }
      }
      addCanvasRenderSubscriber(_PUBSUB, fakeCtx)
      _PUBSUB.publish('canvas.renderer.fillRect', {rect: fakeRect})
    })
  })

  test('we can ask to clear a space', () => {
    expect( () => {
      expect.assertions(4)
      const _PUBSUB = makePubSub()
      const fakeRect = {
        x:Math.random() * 15,
        y: Math.random() * 15,
        width:30,
        height:30
      }
      const fakeCtx = {
        fillStyle: '',
        clearRect(x,y, width, height){
          expect(x).toBe(fakeRect.x)
          expect(y).toBe(fakeRect.y)
          expect(width).toBe(fakeRect.width)
          expect(height).toBe(fakeRect.height)
        }
      }
      addCanvasRenderSubscriber(_PUBSUB, fakeCtx)
      _PUBSUB.publish('canvas.renderer.clearRect', {rect: fakeRect})
    })
  })
})

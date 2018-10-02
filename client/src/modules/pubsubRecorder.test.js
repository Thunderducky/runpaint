import { makePubsubRecorder } from './pubsubRecorder'
import { makePubSub } from './pubsub'

describe('Testing PubsubREcorder', () => {
  test('it works at all', () => {
    expect( () => {
      const PUBSUB = makePubSub()
      const obj = makePubsubRecorder(PUBSUB, 'test')
      expect(obj).toBeTruthy() // it's an object
    }).not.toThrow()
  })
  // TODO: It records when we publish something after it starts
  test('it records when I tell it to listen', () => {
    const PUBSUB = makePubSub()
    const rec = makePubsubRecorder(PUBSUB, 'test').listen()
    PUBSUB.publish('test', 'test1')
    PUBSUB.publish('test', 'test2')
    PUBSUB.publish('test', 'test3')
    expect(rec.count()).toBe(3)
  })
  test('it doesn\'t record by default', () => {
    const PUBSUB = makePubSub()
    const rec = makePubsubRecorder(PUBSUB, 'test')
    PUBSUB.publish('test', 'test1')
    PUBSUB.publish('test', 'test2')
    PUBSUB.publish('test', 'test3')
    expect(rec.count()).toBe(0)
  })
  test('we can stop recording', () => {
    const PUBSUB = makePubSub()
    const rec = makePubsubRecorder(PUBSUB, 'test').listen()
    PUBSUB.publish('test', 'test1')
    PUBSUB.publish('test', 'test2')
    rec.deafen()
    PUBSUB.publish('test', 'test3')
    expect(rec.count()).toBe(2)
  })
  test('we can replay events', () => {
    expect.assertions(2)
    const PUBSUB = makePubSub()
    const rec = makePubsubRecorder(PUBSUB, 'test').listen()
    PUBSUB.publish('test', 'test1')
    PUBSUB.publish('test', 'test2')

    // reversed because we are using pop
    const results = ['test2', 'test1']
    PUBSUB.subscribe('test', msg => {
      expect(msg).toBe(results.pop())
    })
    rec.replay()
  })
  test('we can replay selective events', () => {
    expect.assertions(2)
    const PUBSUB = makePubSub()
    const rec = makePubsubRecorder(PUBSUB, 'test').listen()
    PUBSUB.publish('test', 'test1')
    PUBSUB.publish('test', 'test2')
    PUBSUB.publish('test', 'test3')
    PUBSUB.publish('test', 'test4')

    // reversed because we are using pop
    const results = ['test3', 'test2']
    PUBSUB.subscribe('test', msg => {
      expect(msg).toBe(results.pop())
    })
    rec.replay(1,2)
  })
})

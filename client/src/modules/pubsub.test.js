import { makePubSub } from './pubsub'

let Pubsub1 = makePubSub()
describe('Testing Pubsub', () => {
  beforeEach(() => {
    Pubsub1 = makePubSub()
  })
  test('normal-subscribing-is-errorless', () => {
    expect( () =>
      Pubsub1.subscribe('test.message', (msg, topic) => {}) //eslint-disable-line no-unused-vars
    ).not.toThrow()
  })
  test('subscribing-without-function-produces-error', () => {
    expect(() => Pubsub1.subscribe('test.message')).toThrow()
  })
  test('single-subscriber-should-receive-publications', () => {
    Pubsub1.subscribe('test.message.receivable.single', (msg) => {
      expect(msg).toBe('test1')
    })
    Pubsub1.publish('test.message.receivable.single', 'test1')
  })
  test('all-subscribers-should-receive-publications', () => {
    Pubsub1.subscribe('test.message.receivable.multi', (msg) => {
      expect(msg).toBe('test2')
    })
    Pubsub1.subscribe('test.message.receivable.multi', (msg) => {
      expect(msg).toBe('test2')
    })
    Pubsub1.publish('test.message.receivable.multi', 'test2')
  })
  test('allow-publishing-with-no-subscribers', () => {
    expect(() =>
      Pubsub1.publish('test.message.no-subscribers', 'test3')
    ).not.toThrow()
  })
  test('modifying-message-causes-errors', () => {
    expect(() =>{
      Pubsub1.subscribe('test.message.no.modifying.messages', (msg) => {
        msg.test = true
      })
      Pubsub1.publish('test.message.no.modifying.messages', {test:false})
    }).toThrow()
  })

  test('that-it-supports-subtopic-supertopics', () => {
    expect.assertions(3)
    Pubsub1.subscribe('test.message.supertopic', msg => {
      // should fire twice
      expect(msg.received).toBe(true)
    })
    Pubsub1.subscribe('test.message.supertopic.subtopic', msg => {
      // should fire once
      expect(msg.received).toBe(true)
    })
    Pubsub1.publish('test.message.supertopic.subtopic', {received: true})
    Pubsub1.publish('test.message.supertopic', { received: true})
  })

  test('that-it-supports-unsubscribing', () => {
    expect.assertions(1)
    const subId = Pubsub1.subscribe('test.message.unsubscribe.soon', msg => {
      expect(msg.received).toBe(true)
    })
    Pubsub1.publish('test.message.unsubscribe.soon', { received:true})

    Pubsub1.unsubscribe('test.message.unsubscribe.soon', subId)
    Pubsub1.publish('test.message.unsubscribe.soon', { received:true})

  })

  test('that-the-topic-is-passed-along-as-well', () => {
    expect.assertions(1)
    Pubsub1.subscribe('test.message.topic', (msg,topic) => {
      expect(topic).toBe(test.message.topic)
    })
    Pubsub1.publish('test.message.topic', { notbeing:'tested'})

  })
  test('that-we-can-see-subscriber-count', () => {
    const NOOP = () => {}
    Pubsub1.subscribe('test.subscriber.count', NOOP)
    Pubsub1.subscribe('test.subscriber.count', NOOP)
    const subId = Pubsub1.subscribe('test.subscriber.count', NOOP)
    expect(Pubsub1.subscriberCount('test.subscriber.count')).toBe(3)
    Pubsub1.unsubscribe('test.subscriber.count', subId)
    expect(Pubsub1.subscriberCount('test.subscriber.count')).toBe(2)
  })
})

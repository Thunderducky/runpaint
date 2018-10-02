import { makePubSub } from './pubsub'

const Pubsub1 = makePubSub()
describe('Testing Pubsub', () => {
  test('normal-subscribing-is-errorless', () => {
    expect( () =>
      Pubsub1.subscribe('test.message', (msg, topic) => {}) //eslint-disable-line no-unused-vars
    ).not.toThrow()
  })
  test('subscribing-without-function-produces-error', () => {
    expect(() => Pubsub1.subscribe('test.message')).toThrow()
  })
  test('single-subscriber-should-receive-publications', () => {
    Pubsub1.subscribe('test.message.receivable', (msg) => {
      expect(msg).toBe('test1')
    })
    Pubsub1.publish('test.message.receivable', 'test1')
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

  // TODO: Write test that tries to mutate the message
  // which should not be allowed
})

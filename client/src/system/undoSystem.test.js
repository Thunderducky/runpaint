import { makeUndoSystem } from './undoSystem'
import { makePubSub } from '../modules/pubsub'

describe('test the undo system', () => {
  test('that it can be made at all', () => {
    expect(makeUndoSystem(makePubSub(), ['test'], () => {})).toBeTruthy()
  })
  //Test the golden path
  test('golden case scenario', () => {
    expect.assertions(6)
    const PUBSUB = makePubSub()
    const RESET = () => {     // should be called twice
      expect(true).toBe(true) // just making sure we are calling this
    }
    const FILTER = (msg) => { // NOTE: can also work with the lastMessage as well
      return msg.msg != 'test #4'
    }
    const undoSystem = makeUndoSystem(PUBSUB, ['test1', 'test2'], RESET, FILTER) // no filter
    // Add some initial events
    PUBSUB.publish('test1', 'test #1')
    PUBSUB.publish('test2', 'test #2')
    PUBSUB.publish('test3', 'test #3')
    PUBSUB.publish('test2', 'test #4')
    PUBSUB.publish('test2', 'test #5')

    // now we subscribe for verification
    // test 1 will be called twice
    PUBSUB.subscribe('test1', (msg) => {
      expect(msg).toBe('test #1')
    })
    PUBSUB.subscribe('test2', (msg) => {
      expect(msg).toBe('test #2')
    })

    undoSystem.undo()
    undoSystem.undo()
    undoSystem.redo()
  })
  // TODO: many more tests
  // like RESET HEAD, which will probably require a lot more stuff
})

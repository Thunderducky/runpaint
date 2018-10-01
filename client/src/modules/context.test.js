// TODO: write tests
import { makeContext } from './context'
describe('Context texts', () => {
  test('contexts-are-created-without-error', () => {
    expect(
      () => makeContext()
    ).not.toThrow()
  })
  // TODO: Write test that cover the following
  // 1. The Golden path
  // 2. Requests without providers
  // 3. Provider override errors
  // 4. Provider register => unregister => reregister works
})

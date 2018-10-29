import React from 'react'
import ReactDOM from 'react-dom'
import AddSwatchForm from './AddSwatchForm'
import TestRenderer from 'react-test-renderer'

const fakeSubmitEvent = {
  preventDefault(){}
}
describe('Add Swatch Form Tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<AddSwatchForm />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
  it('will fail without a submit fn', () => {
    const testRenderer = TestRenderer.create(<AddSwatchForm />)
    // let's set the state and then call the submit function directly
    const testInstance = testRenderer.root

    expect(() => {
      testInstance.instance.submit(fakeSubmitEvent)
    }).toThrow()
  })
  it('must not have a blank name', done => {
    const NOOP = () => {}
    const testRenderer = TestRenderer.create(<AddSwatchForm submitFn={NOOP}/>)
    // let's set the state and then call the submit function directly
    const testInstance = testRenderer.root

    testInstance.instance.setState({
      name: '',
      color: '#0000FF'
    },() => {
      expect(testInstance.instance.submit(fakeSubmitEvent)).toBe(false)
      done()
    })
  })
  it('must not have a blank color', done => {
    const NOOP = () => {}
    const testRenderer = TestRenderer.create(<AddSwatchForm submitFn={NOOP}/>)
    // let's set the state and then call the submit function directly
    const testInstance = testRenderer.root
    testInstance.instance.setState({
      name: 'blue',
      color: ''
    },() => {
      expect(testInstance.instance.submit(fakeSubmitEvent)).toBe(false)
      done()
    })
  })
  it('works when populated correctly', done => {
    const NOOP = () => {}
    const testRenderer = TestRenderer.create(<AddSwatchForm submitFn={NOOP}/>)
    // let's set the state and then call the submit function directly
    const testInstance = testRenderer.root
    testInstance.instance.setState({
      name: 'blue',
      color: '#0000FF'
    },() => {
      expect(testInstance.instance.submit(fakeSubmitEvent)).toBe(true)
      done()
    })
  })
})

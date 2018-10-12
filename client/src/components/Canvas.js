// this is the class responsible for managing canvas layers
// right now we will only ever have one
import React from 'react'
import CanvasLayer from './CanvasLayer'
import {makeCanvasLayerRenderer} from '../processers/canvasLayerRenderer'
class Canvas extends React.Component {
  state = {
    width: 0,
    height:0,
  }
  componentDidMount(){
    // TODO: Refactor this to integrate with only PUBSUB and not context if possible
    // Listen to our context for this information
    const {context, PUBSUB } = this.props
    // request the context and set up listeners
    const {width,height} = context.request().canvas
    this.setState({
      width,height
    })

    // we are being lazy and not breaking up the listening at all
    PUBSUB.subscribe('context.canvas.update', () => {
      const {width,height} = context.request().canvas
      this.setState({
        width,height
      })
    })

    // Provide our renderer, which will subscribe to our events with our unique ID one day :)
    const ctx = this.canvasLayer.canvas.getContext('2d')
    this.renderer = makeCanvasLayerRenderer(PUBSUB, ctx)
  }
  render(){
    return (
      <div>
        <CanvasLayer
          ref={cl => this.canvasLayer = cl}
          PUBSUB={this.props.PUBSUB}
          width={this.state.width}
          height={this.state.height}
        />
      </div>
    )
  }
}

export default Canvas

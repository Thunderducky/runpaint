import React from 'react'

// small util to just let us know relatively where
// the click happened
const getRelativeMousePoint = event => {
  // build in adjustment for borders, which we should calculate
  const rect = event.target.getBoundingClientRect()
  const point = {
    x: Math.floor(event.clientX - rect.x - 3), // HARDCODED FOR THE BORDER SIZE
    y: Math.floor(event.clientY - rect.y - 3)
  }
  return point
}

// We need to publish our canvas after we mount?
// or should this be added on demand by a higher component?
class CanvasLayer extends React.Component {
  render(){
    const {PUBSUB, width, height } = this.props
    const {publish:PUB} = PUBSUB
    return (
      <div>
        <canvas
          ref={c => this.canvas = c}
          width={width}
          height={height}
          onMouseDown={ event =>
            PUB('canvas.input.mouse.down', { coords: getRelativeMousePoint(event)})
          }
          onMouseUp={ event =>
            PUB('canvas.input.mouse.up', { coords: getRelativeMousePoint(event)})
          }
          onMouseMove={ event =>
            PUB('canvas.input.mouse.move', { coords: getRelativeMousePoint(event)})
          }
          onMouseEnter={ event =>
            PUB('canvas.input.mouse.enter', { coords: getRelativeMousePoint(event)})
          }
          onMouseLeave={ event =>
            PUB('canvas.input.mouse.exit', { coords: getRelativeMousePoint(event)})
          }
        />
      </div>
    )
  }
}

// props
// width, height, visible

export default CanvasLayer

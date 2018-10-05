import React from 'react'

class MousePositionTracker extends React.Component {
  state = {
    isDown: false,
    inCanvas: false,
    downCell: {x:0,y:0},
    currentCell: {x:0,y:0}
  }
  componentDidMount(){
    const PUBSUB = this.props.PUBSUB

    PUBSUB.subscribe('canvas.mouse.enter', () => {
      this.setState({inCanvas: true})
    })
    PUBSUB.subscribe('canvas.mouse.down', msg => {
      this.setState({isDown: true, downCell: msg.cell })
    })
    PUBSUB.subscribe('canvas.mouse.up', () => {
      this.setState({isDown: false})
    })
    PUBSUB.subscribe('canvas.mouse.move', msg => {
      this.setState({currentCell: msg.cell })
    })
    PUBSUB.subscribe('canvas.mouse.exit', () => {
      this.setState({inCanvas: false})
    })

  }
  render(){
    const formatPosition = cell => `(${cell.x}, ${cell.y})`
    return (
      <div>
        {
          this.state.isDown && this.state.inCanvas
            ? 'Start ' + formatPosition(this.state.downCell)
            : ''
        }
        &nbsp;
        {
          this.state.inCanvas
            ? 'Current ' + formatPosition(this.state.currentCell)
            : ''
        }

      </div>
    )
  }
}

export default MousePositionTracker

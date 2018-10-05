import React from 'react'
import { makeCanvasStateManager } from './canvasStateManager'
import { addCanvasRenderSubscriber } from './canvasRenderer'
import { addCanvasHistoryListener } from './canvasHistoryListener'
import {PUBSUB} from '../../modules/pubsub'

// THESE BELONG IN SOME COMMON FILE
const getRelativeMousePoint = event => {
  const rect = event.target.getBoundingClientRect()
  const point = {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y
  }
  return point
}
// exportable
const p = (x,y) => { return {x,y} }
const rect = (x,y,width,height) => {
  return {
    x,y,width,height
  }
}

// specific to here
const mouseProcess = (event, zoom) => {
  const point = getRelativeMousePoint(event),
    cellX = Math.floor(point.x/zoom),
    cellY = Math.floor(point.y/zoom)
  const cell = p(cellX, cellY)
  return cell
}




class Canvas extends React.Component {
  constructor(props){
    super()
    // TODO: factor PUBSUB from props :P
    this.manager = makeCanvasStateManager(PUBSUB)
    this.history = addCanvasHistoryListener(PUBSUB)
    this.subscriber = null // initialized in componentDidMount

    this.state = {
      cellsWide: props.width,
      cellsHigh: props.height
    }
  }
  componentDidMount(){
    this.ctx = this.canvasEl.getContext('2d')
    this.subscriber = addCanvasRenderSubscriber(this.ctx,PUBSUB)

    // If a mouse up happens anywhere we'll let go
    // we also might tack this on if you leave the borders or something
    document.addEventListener('mouseup', event => {
      PUBSUB.publish('canvas.mouse.up',{ cell: mouseProcess(event, this.props.zoom)})
    })

    // currently color switches are still hard coded in
    // This command is also used with the undo system
    PUBSUB.subscribe('canvas.command.paint', (msg) => {
      const { zoom, color='white' } = this.props
      const { x, y } = msg.cell
      const cellRect = rect(x*zoom, y*zoom, zoom, zoom)
      if(!this.props.eraserActive){
        PUBSUB.publish('canvas.renderer.fillRect', {
          style: color,
          rect: cellRect
        })
      } else {
        PUBSUB.publish('canvas.renderer.clearRect', {
          rect: cellRect
        })
      }
    })

    PUBSUB.subscribe('canvas.request.imageData', ({cb}) => {
      // NOTE: based off of: https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
      let download = this.canvasEl.toDataURL('image/png')
      download = download.replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
      download = download.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Mastapeece.png')
      cb(download)
    })
  }
  render(){
    const { zoom } = this.props
    return (
      <div>
        <canvas
          ref={c => this.canvasEl = c}
          height={this.state.cellsHigh * zoom}
          width={this.state.cellsWide * zoom}

          // CONNECT OUR EVENTS
          onMouseDown={event =>
            PUBSUB.publish('canvas.mouse.down', {cell: mouseProcess(event,zoom) })}
          onMouseMove={event =>
            PUBSUB.publish('canvas.mouse.move', {cell: mouseProcess(event,zoom) })}
          onMouseEnter={event =>
            PUBSUB.publish('canvas.mouse.enter', {cell: mouseProcess(event,zoom) })}
          onMouseLeave={event =>
            PUBSUB.publish('canvas.mouse.enter', {cell: mouseProcess(event,zoom) })}
        >
          No Canvas Support
        </canvas>
      </div>
    )
  }
}



export default Canvas

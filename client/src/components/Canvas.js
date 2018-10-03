import React from 'react'
import { addCanvasRenderSubscriber } from '../modules/canvasRenderer'
import {PUBSUB} from '../modules/pubsub'

const getRelativeMousePoint = event => {
  const rect = event.target.getBoundingClientRect()
  const point = {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y
  }
  return point
}
const p = (x,y) => { return {x,y} }
const rect = (x,y,width,height) => {
  return {
    x,y,width,height
  }
}

// This Component is really unmanaged
class Canvas extends React.Component {
  constructor(props){
    super()
    this.mouseDown = false
    this.state = {
      cellsWide: props.width,
      cellsHigh: props.height
    }
    this.undoSystem = props.undoSystem
  }
  componentDidMount(){
    this.ctx = this.canvasEl.getContext('2d')
    addCanvasRenderSubscriber(this.ctx,PUBSUB)
    // TODO: Move the recorder out of the canvas

    document.addEventListener('mouseup', () => {
      this.mouseDown = false
      // const point = getRelativeMousePoint(event);
      // console.log("UP", point);
    })

  }

  onCanvasMouseDown = event => {
    this.mouseDown = true
    // const point = getRelativeMousePoint(event);
    // console.log("DOWN", point);
    const { zoom, color='white' } = this.props
    const point = getRelativeMousePoint(event),
      cellX = Math.floor(point.x/zoom),
      cellY = Math.floor(point.y/zoom)

    if(this.props.eraserActive){
      this.eraseCell(p(cellX, cellY))
    } else {
      this.paintCell(p(cellX, cellY), color)
    }
  }

  // track changes and be able to "rerender"
  onCanvasMouseMove = event => {
    const point = getRelativeMousePoint(event)
    const { zoom, color='white' } = this.props
    if(this.mouseDown){
      // console.log("MOVE", point);

      const cellX = Math.floor(point.x/zoom)
      const cellY = Math.floor(point.y/zoom)
      if(this.props.eraserActive){
        this.eraseCell(p(cellX, cellY))
      } else {
        this.paintCell(p(cellX, cellY), color)
      }
    }
  }

  paintCell = ({x,y}, style) => {
    const { zoom } = this.props
    this.undoSystem.resetHead()
    PUBSUB.publish('canvas.renderer.fillRect',
      {
        style,
        rect: rect(x * zoom, y * zoom, zoom, zoom)
      }
    )
  }
  eraseCell = ({x,y}) => {
    const { zoom } = this.props
    this.undoSystem.resetHead()
    PUBSUB.publish('canvas.renderer.clearRect',
      {
        rect: rect(x * zoom, y * zoom, zoom, zoom)
      }
    )
  }

  exportAsPNG = event => {
    // based off of: https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
    let download = this.canvasEl.toDataURL('image/png')
    download = download.replace(/^data:image\/[^;]*/, 'data:application/octet-stream')

    /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
    download = download.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Mastapeece.png')
    event.target.href = download
  }

  render(){
    const {
      zoom = 1
    } = this.props
    return (
      <div>
        <canvas
          ref={c => this.canvasEl = c}
          height={this.state.cellsHigh * zoom}
          width={this.state.cellsWide * zoom}
          onMouseDown={this.onCanvasMouseDown}
          onMouseMove={this.onCanvasMouseMove}
        >
          No Canvas Support
        </canvas>
        <div><a style={{color:'white'}} download="Mastapeece.png" onClick={this.exportAsPNG}>Export</a></div>
      </div>
    )
  }
}

export default Canvas

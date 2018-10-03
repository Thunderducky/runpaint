import React from 'react'
import { addCanvasRenderSubscriber } from '../modules/canvasRenderer'
import {PUBSUB} from '../modules/pubsub'

let undoIndex = 0

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
    this.recorder.rollback(undoIndex)
    undoIndex = 0
    PUBSUB.publish('canvas.renderer.fillRect',
      {
        style,
        rect: rect(x * zoom, y * zoom, zoom, zoom)
      }
    )
  }
  eraseCell = ({x,y}) => {
    const { zoom } = this.props
    this.recorder.rollback(undoIndex)
    undoIndex = 0
    PUBSUB.publish('canvas.renderer.clearRect',
      {
        rect: rect(x * zoom, y * zoom, zoom, zoom)
      }
    )
  }

  render(){
    const {
      zoom = 1
    } = this.props
    return (
      <canvas
        ref={c => this.canvasEl = c}
        height={this.state.cellsHigh * zoom}
        width={this.state.cellsWide * zoom}
        onMouseDown={this.onCanvasMouseDown}
        onMouseMove={this.onCanvasMouseMove}
      >
        No Canvas Support
      </canvas>
    )
  }
}

export default Canvas

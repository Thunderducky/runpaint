import React from 'react'
import { addCanvasRenderSubscriber } from '../modules/canvasRenderer'
import {PUBSUB} from '../modules/pubsub'
import { makePubsubRecorder } from '../modules/pubsubRecorder'

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

const sameRect = (a,b) => {
  return a.x === b.x && a.y === b.y
    && a.width === b.width
    && a.height === b.height
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
    this.recorder = makePubsubRecorder(
      PUBSUB,
      'canvas.renderer.fillRect',
      (msg, lastmsg) => {
        return !((msg.style === lastmsg.style)
          && sameRect(msg.rect, lastmsg.rect))
      }).listen()

    // TODO: Make into an official context to listen to and ask for
    // PUBSUB the keyboard
    document.onkeydown = (event) => {
      if(event.key === 'z'){
        this.undo()
      }
      if(event.key === 'x'){
        this.redo()
      }
    }
    document.addEventListener('mouseup', () => {
      this.mouseDown = false
      // const point = getRelativeMousePoint(event);
      // console.log("UP", point);
    })

  }

  // THIS IS PROBLEMATIC
  undo = () => {
    undoIndex++
    if(this.recorder.count()-(undoIndex + 1) < -1){
      undoIndex--
    } else {
      PUBSUB.publish('canvas.renderer.clearRect', {rect: rect(0,0,640,640)})
      this.recorder.replay(0, this.recorder.count()-(undoIndex + 1)) // replay all but the last 2
    }
  }
  // OPTIMIZE: make it only go one step forward
  redo = () => {
    undoIndex--
    if(undoIndex < 0){
      undoIndex = 0
    } else {
      //PUBSUB.publish('canvas.renderer.clearRect', {rect: rect(0,0,640,640)})
      this.recorder.replay(this.recorder.count()-(undoIndex + 1), this.recorder.count()-(undoIndex + 1)) // replay all but the last 2
    }
  }

  onCanvasMouseDown = event => {
    this.mouseDown = true
    // const point = getRelativeMousePoint(event);
    // console.log("DOWN", point);
    const { zoom, color='white' } = this.props
    const point = getRelativeMousePoint(event)
    const cellX = Math.floor(point.x/zoom)
    const cellY = Math.floor(point.y/zoom)
    this.paintCell(p(cellX, cellY), color)
  }

  // track changes and be able to "rerender"
  onCanvasMouseMove = event => {
    const point = getRelativeMousePoint(event)
    const { zoom, color='white' } = this.props
    if(this.mouseDown){
      // console.log("MOVE", point);

      const cellX = Math.floor(point.x/zoom)
      const cellY = Math.floor(point.y/zoom)
      this.paintCell(p(cellX, cellY), color)
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

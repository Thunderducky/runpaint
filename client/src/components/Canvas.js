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
    // Kept outside of state because this
    // is a control mechanism,
    // not displayed information
    this.mouseDown = false,
    this.state = {
      mouseInCanvas: false,
      mouseCellPosition: {x:0,y:0},
      mouseDownCellPosition: {x:0,y:0},
      mouseIsDown: false,
      cellsWide: props.width,
      cellsHigh: props.height
    }
    this.undoSystem = props.undoSystem
  }
  componentDidMount(){
    this.ctx = this.canvasEl.getContext('2d')
    addCanvasRenderSubscriber(this.ctx,PUBSUB)
    // TODO: Move the recorder out of the canvas

    document.addEventListener('mouseup', event => {
      this.mouseDown = false
      this.setState({mouseIsDown: false})
      this.updateMouseCellPosition(event)
      // const point = getRelativeMousePoint(event);
      // console.log("UP", point);
    })

  }

  updateMouseCellPosition = event => {
    const { zoom } = this.props
    const point = getRelativeMousePoint(event),
      cellX = Math.floor(point.x/zoom),
      cellY = Math.floor(point.y/zoom)
    const cell = p(cellX, cellY)
    this.setState({mouseCellPosition: cell })
    return cell
  }

  onCanvasMouseDown = event => {

    const cell = this.updateMouseCellPosition(event)
    if(this.mouseDown){
      this.setState({mouseIsDown: true})
    } else {
      this.setState({
        mouseIsDown: true,
        mouseDownCellPosition: cell
      })
    }

    this.mouseDown = true

    const { color='white' } = this.props


    if(this.props.eraserActive){
      this.eraseCell(cell)
    } else {
      this.paintCell(cell, color)
    }
  }

  onCanvasEnter = event => {
    this.updateMouseCellPosition(event)
    this.setState({mouseInCanvas: true})
  }

  onCanvasExit = event => {
    this.updateMouseCellPosition(event)
    this.setState({mouseInCanvas: false})
  }

  // track changes and be able to "rerender"
  onCanvasMouseMove = event => {
    const cell = this.updateMouseCellPosition(event)
    const { color='white' } = this.props
    if(this.mouseDown){
      if(this.props.eraserActive){
        this.eraseCell(cell)
      } else {
        this.paintCell(cell, color)
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

  renderCellPosition = (cell) => {
    return `(${cell.x}, ${cell.y})`
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
          onMouseEnter={this.onCanvasEnter}
          onMouseLeave={this.onCanvasExit}
        >
          No Canvas Support
        </canvas>
        <div style={{display:'flex', justifyContent: 'space-between'}}>
          <div><a style={{color:'white'}} download="Mastapeece.png" onClick={this.exportAsPNG}>Export</a></div>
          <div>
            {
              (this.state.mouseIsDown)
                ? 'Start ' + this.renderCellPosition(this.state.mouseDownCellPosition)
                : ''
            }
            {
              (this.state.mouseInCanvas)
                ? 'Current ' + this.renderCellPosition(this.state.mouseCellPosition)
                : ''
            }

          </div>
        </div>
      </div>
    )
  }
}

export default Canvas

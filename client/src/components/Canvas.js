import React from "react"

const getRelativeMousePoint = event => {
  const rect = event.target.getBoundingClientRect();
  const point = {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y
  };
  return point;
}
const p = (x,y) => { return {x,y} }
const chance = (c) => Math.random() <= c;

// This Component is really unmanaged
class Canvas extends React.Component {
  constructor(props){
    super();
    this.mouseDown = false;
    this.state = {
      cellsWide: props.width,
      cellsHigh: props.height
    }
  }
  componentDidMount(){
    this.ctx = this.canvasEl.getContext("2d")
    document.addEventListener("mouseup", event => {
      this.mouseDown = false;
      // const point = getRelativeMousePoint(event);
      // console.log("UP", point);
    })
  }

  onCanvasMouseDown = event => {
    this.mouseDown = true;
    // const point = getRelativeMousePoint(event);
    // console.log("DOWN", point);
  }

  // track changes and be able to "rerender"
  onCanvasMouseMove = event => {
    const point = getRelativeMousePoint(event);
    const { zoom, color="white" } = this.props;
    if(this.mouseDown){
      // console.log("MOVE", point);
      this.ctx.fillStyle = "white";
      const cellX = Math.floor(point.x/zoom);
      const cellY = Math.floor(point.y/zoom);
      this.paintCell(p(cellX, cellY), color);
    }
  }

  paintCell = ({x,y}, style) => {
    const { zoom } = this.props;
    console.log(x,y);
    this.ctx.fillStyle = style;
    this.ctx.fillRect(
      x * zoom,
      y * zoom,
      zoom,
      zoom,
    )
  }

  render(){
    const {
      zoom = 1,
      width,
      height
    } = this.props;
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
    );
  }
}

export default Canvas;

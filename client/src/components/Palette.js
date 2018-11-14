import React from 'react'
import Swatch from './Swatch'
import * as Icons from './Icons'

const style={
  closeBox: {
    position:"absolute",
    right:0,
    top:0,
    cursor:"pointer" // TODO: choose something better
  }
}

// convenience function for making colors
const c = (colorCode, name) => ({
  color: colorCode,
  name
})

const colors = [
  c('#00000000', 'Eraser'),
  c('#FFFFFFFF', 'white'),
  c('#FF0000FF', 'red'),
  c('#00FF00FF', 'green'),
  c('#0000FFFF', 'blue'),
  c('#000000FF', 'black')
]

class Palette extends React.Component{
  state = {
    activeColor: colors[0].color,
    activeTool: 'dotpen',
    palette: []
  }
  componentDidMount(){
    const {subscribe: SUB } = this.props.PUBSUB
    SUB('context.canvas.update.style',({style}) => {
      this.setState({activeColor: style})
    })

    SUB('context.canvas.update.tool',({tool}) => {
      this.setState({activeTool: tool})
    })

    const { palette } = this.props.context.request()
    this.setState({palette})

    SUB('context.palette.update',({palette}) => {
      this.setState({palette})
    })
  }

  renderToolIcon = () => {
    switch(this.state.activeTool){
    case 'dotpen':
      return (<Icons.Pen />)
    case 'eraser':
      return (<Icons.Eraser />)
    case 'smartFill':
      return (<Icons.Tint />)
    default:
      throw new Error('render tool icon isn\'t set')
    }
  }

  eraserClick(){
    this.setState({activeColor: ""})
    this.props.PUBSUB.publish('context.canvas.set.tool', {tool: 'eraser'})
  }
  triggerAddColor(){
    const name = prompt("provide a name")
    const color = prompt("provie a color code (#FFFFFF)") + "FF"
    this.props.PUBSUB.publish('context.palette.add', {name, color})
  }
  triggerRemoveColor(index){
    this.props.PUBSUB.publish('context.palette.remove', {index})
  }

  render(){
    const wrapClickColor = (color) => {
      const clickHandler = () => {
        if(this.state.activeTool === 'eraser'){
          this.props.PUBSUB.publish('context.canvas.set.tool', {tool: 'dotpen'})
        }
        this.props.PUBSUB.publish('context.canvas.set.style', {style: color})
      }
      return clickHandler
    }

    return (
      <div>
        {/* I am being to clever here with the syntax, dumb it up */}
        <div style={{border: 'white solid 1px'}}>
          {/* TODO: We should make this a seperate thing */}
          <Swatch color={this.state.activeColor}>
            {this.renderToolIcon()}
          </Swatch>
        </div>
        {this.state.palette.map(
          ({color, name}, index) => (
            <Swatch key={index} color={color} onClick={wrapClickColor(color)}>
              <div style={style.closeBox}onClick={() => this.triggerRemoveColor(index)}>x</div>
              {name}
            </Swatch>
          )
        )}
        <Swatch color="#00000000" onClick={() =>this.triggerAddColor()}>
          <div style={{padding:15, background:"white", color:"black", textAlign:"center"}}>
            +
          </div>
        </Swatch>
      </div>
    )
  }
}

export default Palette

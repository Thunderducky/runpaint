import React from 'react'
import Tool from './Tool'
import * as Icons from './Icons'
class Toolbar extends React.Component {
  state = {
    activeTool: 'dotpen'
  }
  componentDidMount(){
    this.props.PUBSUB.subscribe('context.canvas.update.tool', ({tool}) => {
      this.setState({activeTool: tool})
    })
  }

  setTool = tool => {
    this.props.PUBSUB.publish('context.canvas.set.tool', { tool })
  }

  clearAll = () => {
    this.props.PUBSUB.publish('command.clear', {});
  }

  fillAll = () => {
    // TODO: this will probably have to go through the UI Context
    this.props.PUBSUB.publish('command.fillAll', {});
  }

  render(){
    const isActive = tool => tool === this.state.activeTool
    return (
      <div style={{display:'flex'}}>
        <Tool onClick={() => this.setTool('dotpen')} isActive={isActive('dotpen')}>
          <Icons.Pen/> Dotpen
        </Tool>
        <Tool onClick={() => this.setTool('eraser')} isActive={isActive('eraser')}>
          <Icons.Eraser/> Eraser
        </Tool>
        <Tool onClick={() => this.clearAll() }>
          <Icons.Eraser/> Clear All
        </Tool>
        <Tool onClick={() => this.fillAll() }>
          Fill All
        </Tool>
      </div>
    )
  }
}

export default Toolbar

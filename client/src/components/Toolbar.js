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
  // if it's a paintbucket we need to change back the
  // default OR allow empty paintbucket paints
  setTool = tool => {
    this.props.PUBSUB.publish('context.canvas.set.tool', { tool })
  }

  clearAll = () => {
    this.props.PUBSUB.publish('command.clear', {})
  }

  savePalette = () => {
    this.props.PUBSUB.publish('context.palette.save', {})
  }

  loadPalette = () => {
    this.props.PUBSUB.publish('context.palette.load', {})
  }

  defaultPalette = () => {
    this.props.PUBSUB.publish('context.palette.default', {})
  }

  render(){
    const isActive = tool => tool === this.state.activeTool
    return (
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <Tool onClick={() => this.setTool('dotpen')} isActive={isActive('dotpen')}>
          <Icons.Pen/> Dotpen
        </Tool>
        {/* <Tool onClick={() => this.setTool('eraser')} isActive={isActive('eraser')}>
          <Icons.Eraser/> Eraser
        </Tool> */}
        <Tool onClick={() => this.setTool('smartFill') } isActive={isActive('smartFill')}>
          <Icons.Tint/>Smart Fill
        </Tool>
        <Tool onClick={() => this.clearAll() }>
          <Icons.Eraser/> Clear All
        </Tool>
        <Tool onClick={() => this.savePalette() }>
          Save Palette
        </Tool>
        <Tool onClick={() => this.loadPalette() }>
          Load Palette
        </Tool>
        <Tool onClick={() => this.defaultPalette() }>
          Restore Default Palette
        </Tool>

      </div>
    )
  }
}

export default Toolbar

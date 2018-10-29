import React from 'react'

const ACTIVE_COLOR = '#aaaaff'
const DEFAULT_COLOR = '#cccccc'

const style = {
  tool: {
    padding:15,
    borderRadius:15,
    background:'#888888',
    color:DEFAULT_COLOR,
    margin: '0 15px'
  },
  activeTool: {
    color:ACTIVE_COLOR
  }
}


const Tool = props => {
  const propStyle = props.isActive ? style.activeTool : {}
  const toolStyle = Object.assign({}, style.tool, propStyle)
  return (
    <div style={toolStyle} onClick={props.onClick}>
      {props.children}
    </div>
  )
}

export default Tool

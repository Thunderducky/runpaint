import React from 'react'

const ACTIVE_COLOR = '#aaaaff'

const style = {
  tool: {
    padding:5,
    borderRadius:5,
    background:'#888888',
    cursor:"pointer",
    // color:DEFAULT_COLOR,
    margin: '0 2px'
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

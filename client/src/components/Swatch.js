import React from 'react'
import { isDark } from '../modules/colorHelper'

const styles = {
  swatch: {
    padding:15,
    cursor:'pointer',
    position:'relative',
    flexGrow:1
  }
}
const NOOP = () => {}

const Swatch = props => {
  const propStyle = {}
  if(props.color){
    propStyle.background = props.color
    propStyle.color = isDark(props.color) ? 'white': 'black'
  } else {
    propStyle.border = '1px solid white'
  }
  const style = Object.assign(propStyle, styles.swatch)
  return (
    <div style={style} onClick={props.onClick || NOOP}>
      {props.children}
    </div>
  )
}

export default Swatch

import React from 'react'
import { isDark } from '../modules/colorHelper'
const styles = {
  swatch: {
    margin:15,
    padding:15
  }
}
const NOOP = () => {}

const Swatch = props => {
  const propStyle = {
    background: props.color,
    color: isDark(props.color) ? 'white': 'black'
  }
  const style = Object.assign(propStyle, styles.swatch)
  return (
    <div style={style} onClick={props.onClick || NOOP}>
      {props.children}
    </div>
  )
}

export default Swatch

import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  swatch: {
    margin:15,
    padding: 15
  }
}

const Swatch = (props) => (
  <div onClick={props.onClick} style={Object.assign({background: props.color}, styles.swatch)}>
    {props.children}
  </div>
)

Swatch.propTypes = {
  color: PropTypes.string
}

export default Swatch

import React from 'react';

class MouseTracker extends React.Component {
  state = {
    x: 0,
    y: 0
  }
  componentDidMount(){
    const {subscribe:SUB} = this.props.PUBSUB;
    SUB("context.update.activeCell", ({cells}) => {
      this.setState({x: cells.x, y: cells.y});
    })
  }
  render(){
    return <div>{this.state.x},{this.state.y}</div>
  }
}

export default MouseTracker;

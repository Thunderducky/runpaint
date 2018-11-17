import React from 'react'
import Canvas from './Canvas'
import Palette from './Palette'
import Toolbar from './Toolbar'
import MouseTracker from './MouseTracker'
//const tools = ['dotpen', 'eraser']
// Let's set up the grid and start having people get positioned on it
const styles = {
  mainGrid: {
    display:'grid',
    gridTemplateColumns: 'auto 200px',
    gridTemplateRows: '8% 84% 8%',
    height:'100%',
    width:'100%'
  },
  topMain:{
    gridArea: '1/1',
    border:'1px solid white'
  },
  midMain:{
    paddingTop:10,
    gridArea: '2/1',
    border:'1px solid white',
    display: 'flex',
    justifyContent:'center'
  },
  lowMain:{ // haha lo-mein
    gridArea: '3/1',
    border:'1px solid white',
    padding: "0 15px"
  },
  sidebar:{
    gridArea: '1/2/4/2',
    border:'1px solid white'
  }
}
const Main = props => {
  return (
    <div style={styles.mainGrid}>
      <div style={styles.topMain}>
        <h1 className="terminal">paintaday</h1>
      </div>
      <div style={styles.midMain}>
        <Canvas PUBSUB={props.PUBSUB} context={props.context}/>
      </div>
      <div style={styles.lowMain}>
        <MouseTracker PUBSUB={props.PUBSUB} />
        <Toolbar PUBSUB={props.PUBSUB}/>
      </div>
      <div style={styles.sidebar}>
        <Palette PUBSUB={props.PUBSUB} context={props.context}/>
      </div>
    </div>
  )
}

export default Main

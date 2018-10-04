import React from 'react'

class AddSwatchForm extends React.Component {
  state = {
    name: '',
    color: ''
  }

  submit = event =>{
    event.preventDefault()
    // TODO: Validations
    if(this.props.submitFn){
      if(this.state.name.trim() !== ''){
        alert('color must have a name')
        return
      }
      if(this.state.name.trim() !== ''){
        alert('color must have a color value')
        return
      }
      this.props.submitFn(this.state.name, this.state.color)
      this.setState({name: '', color: ''})
    } else {
      throw new Error('You must have a prop \'submitFn\' defined')
    }
  }

  handleInput= event => {
    const {name, value} = event.target
    this.setState({[name]:value})
  }

  render(){
    return (
      <div style={{marginLeft: 15}}>
        Name<br/><input name="name" placeholder="white" onChange={this.handleInput} value={this.state.name}/><br/>
        Color (#FFFFFF)<br/><input name="color" placeholder="#FFFFFF" onChange={this.handleInput} value={this.state.color} /><br/>
        <div style={{
          width:30,
          height:30,
          margin:5,
          backgroundColor:this.state.color || 'white'
        }}>
        </div>
        <button onClick={this.submit}>Add</button>
      </div>
    )
  }
}

export default AddSwatchForm

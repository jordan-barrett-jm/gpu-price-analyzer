import React from 'react';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gpu_name: '',
            price_data: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        this.setState({
           gpu_name: event.target.value 
        });
    }
    
    handleSubmit(event){
        console.log(this.state.gpu_name);
    }
    render(){
        return (
            <form onSubmit={this.handleSubmit}>
                <label>GPU Name</label>
                <input type="text" value={this.state.price_data} onChange={this.handleChange}/>
                <input type="submit" value="Submit"/>
            </form>
        );
  }
}

export default App;

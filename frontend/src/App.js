import React from 'react';
import axios from 'axios';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gpu_name: '',
            price_data: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        this.setState({
           gpu_name: event.target.value 
        });
    }
    
    async handleSubmit(event){
        console.log(this.state.gpu_name);
        event.preventDefault();
        await axios.post("http://127.0.0.1:9000/api", 
        {"gpu_name": this.state.gpu_name}).then(res=> {
            console.log(res.data);
            this.setState({
                price_data: res.data
            });
        })
    }
    render(){
        return (
            <div>
            <form onSubmit={this.handleSubmit}>
                <label>GPU Name</label>
                <input type="text" value={this.state.gpu_name} onChange={this.handleChange}/>
                <input type="submit" value="Submit"/>
            </form>
            {this.state.price_data.length > 0 ? 
                <div>
                    <table>
                        <thead>
                            <th>Post Title</th>
                            <th>Post Body</th>
                            <th>Post Link</th>
                        </thead>
                        <tbody>
                        {this.state.price_data.map((post) => (
                            <tr>
                                <td>{post.post_title}</td>
                                <td>{post.post_body}</td>
                                <td>{post.link}</td>
                            </tr>
                        ))}
                        </tbody>
                        
                    </table>
                </div>
             : "ntn yet" }
            </div>
        );
  }
}

export default App;

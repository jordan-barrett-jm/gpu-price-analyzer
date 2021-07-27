import React from 'react';
import axios from 'axios';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gpu_name: '',
            price_data: [],
            price_list: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange(event){
        this.setState({
           gpu_name: event.target.value 
        });
    }
    
    handleClick(price){
        console.log(price);
        var arr = this.state.price_list;
        arr.push(price);
        this.setState({
            price_list: arr
        });
    }
    
    renderParagraph(text){
        var reg =  new RegExp('\\$[-0-9.,]+[-0-9.,a-zA-Z]*\\b');
        var arr = text.split(" ").map((word) => {
        return reg.test(word) === true ? <span onClick={() => this.handleClick(word)}><mark>{word}</mark> </span>
        : <span>{word} </span>
        });
        return arr;
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
                <label>GPU Name: </label>
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
                                <td>{this.renderParagraph(post.post_body)}</td>
                                <td>{post.link}</td>
                            </tr>
                        ))}
                        </tbody>
                        
                    </table>
                </div>
             : <div>Price data not found</div> }
             
             {this.state.price_list.length > 0 ? 
                <div>
                    <ul>
                    {this.state.price_list.map( price => (
                        <li>{price}</li>
                    ) )}
                    </ul>
                </div>
             
             : <div>Price list empty</div>}
            </div>
        );
  }
}

export default App;

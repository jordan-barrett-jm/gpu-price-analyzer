import React from 'react';
import axios from 'axios';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gpu_name: '',
            price_data: [],
            average_price : 0,
            loading: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderParagraph = this.renderParagraph.bind(this);
    }
    handleChange(event){
        this.setState({
           gpu_name: event.target.value 
        });
    }
    
    
    renderParagraph(text){
        var reg =  new RegExp('\\$[-0-9.,]+[-0-9.,a-zA-Z]*\\b');
        var price_arr = [];
        var total = 0;
        var avg = 0;
        var arr = text.split(" ").map((word) => {
            var price_check = reg.test(word);
            return price_check ? <span><mark>{word}</mark> </span>
            : <span>{word} </span>
        });
        return arr;
    }

    
    async handleSubmit(event){
        this.setState({
            loading: true
        });
        console.log(this.state.gpu_name);
        event.preventDefault();
        await axios.post("http://127.0.0.1:9000/api", 
        {"gpu_name": this.state.gpu_name}).then(res=> {
            console.log(res.data);
            var reg =  new RegExp('\\$[-0-9.,]+[-0-9.,a-zA-Z]*\\b');
            var reg2 =  new RegExp('(\\d+([,\.]\\d+)?k?)');
            var price_arr = [];
            var total = 0;
            var avg = 0;
            var price_data = []
            res.data.forEach((p_data) => {
                var gpu_price = p_data.post_body.match(reg)[0];
                var gpu_price = parseFloat(gpu_price.match(reg2)[0].replace(",",""));
                console.log(gpu_price);
                total = total + gpu_price;
                price_arr.push(gpu_price);
                avg = total / (price_arr.length); 
                p_data.price = gpu_price;
                price_data.push(p_data);
            })
            this.setState({
                price_data: price_data,
                average_price: avg,
                loading: false
                
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
            {this.state.price_data.length > 0 && !this.state.loading? 
                <div>
                    <table>
                        <thead>
                            <th>Price</th>
                            <th>Link</th>
                        </thead>
                        <tbody>
                        {this.state.price_data.map((post) => (
                            <tr>
                                <td>${post.price}</td>
                                <td><a href={post.link}>Link</a></td>
                            </tr>
                        ))}
                        </tbody>
                        
                    </table>
                    <p>Average price for a {this.state.gpu_name} is ${this.state.average_price}</p>
                </div>
             : "" }
             {this.state.loading ?
                <p>loading</p>
             : ""}
            </div>
        );
  }
}

export default App;

import React from 'react';
import axios from 'axios';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gpu_name: '',
            price_data: [],
            price_list: [],
            average_price : 0,
            total_price: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.calcAvg = this.calcAvg.bind(this);
        this.renderParagraph = this.renderParagraph.bind(this);
    }
    handleChange(event){
        this.setState({
           gpu_name: event.target.value 
        });
    }
    
    async calcAvg(price){
        console.log(price);
        var arr = this.state.price_list;
        var avg = this.state.average_price;
        var total = this.state.total_price;
        var reg =  new RegExp('(\\d+([,\.]\\d+)?k?)');
        var gpu_price = parseFloat(price.match(reg)[0].replace(",",""));
        var total = total + gpu_price;
        arr.push(price);
        avg = total / (arr.length); 
        console.log(gpu_price);
        console.log(avg);
        console.log(arr.length)
        await this.setState({
            price_list: arr,
            average_price: avg,
            total_price: total
        });
        console.log(this.state.price_list.length);
        console.log(this.state.average_price);
        
        
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
            res.data.forEach((p_data) => {
                var gpu_price = p_data.post_body.match(reg)[0];
                var gpu_price = parseFloat(gpu_price.match(reg2)[0].replace(",",""));
                console.log(gpu_price);
                total = total + gpu_price;
                price_arr.push(gpu_price);
                avg = total / (price_arr.length); 
            })
            this.setState({
                price_data: res.data,
                price_list: price_arr,
                average_price: avg
                
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
                    <p>Average price for a {this.state.gpu_name} is {this.state.average_price}</p>
                </div>
             
             : <div>Price list empty</div>}
            </div>
        );
  }
}

export default App;

import React from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import { Message, Grid, Table, Form, Dimmer, Loader, Container, Header } from 'semantic-ui-react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            search_name: '',
            price_data: [],
            average_price : 0,
            loading: false,
            error: false,
            gpu_name: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderParagraph = this.renderParagraph.bind(this);
    }
    handleChange(event){
        this.setState({
           search_name: event.target.value 
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
            loading: true,
            error: false
        });
        console.log(this.state.search_name);
        event.preventDefault();
        await axios.post("http://127.0.0.1:9000/api", 
        {"gpu_name": this.state.search_name}).then(res=> {
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
                loading: false,
                gpu_name: this.state.search_name
                
            });
        }).catch(error => {
            this.setState({
                error: true,
                loading: false,
                gpu_name: this.state.search_name,
                price_data: []
            });
        });
    }
    render(){
        const Plot = createPlotlyComponent(Plotly);
        const prices = []
        this.state.price_data.forEach( post => {
            prices.push(post.price);
        })
        return (
            <Container style={{ margin: 20 }} textAlign='center'>
                <Header as="h1">GPU Price Analyzer</Header>
                <Container align="left">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Input onChange={this.handleChange} value={this.state.search_name} placeholder="RTX 2060" label="Enter the GPU name" />
                    <Form.Button>Analyze</Form.Button>
                </Form>
                </Container>
                {this.state.price_data.length > 0 && !this.state.loading? 
                        <div>
                        <Header>Average price for a {this.state.gpu_name} is ${this.state.average_price}</Header>
                        <Plot
                            data={[
                              {
                                y: prices,
                                type: 'scatter',
                                mode: 'markers',
                                marker: {color: 'blue'},
                              }
                            ]}
                            layout={ {title: 'Price Distribution Graph'} }
                          />
                        <Grid>
                        <Grid.Column width={4}>
                        <Table basic="very">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Price</Table.HeaderCell>
                                    <Table.HeaderCell>Listing</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            {this.state.price_data.map((post) => (
                                <Table.Row>
                                    <Table.Cell>${post.price}</Table.Cell>
                                    <Table.Cell><a target="_blank" href={post.link}>Link</a></Table.Cell>
                                </Table.Row>
                            ))}
                            </Table.Body>
                            
                        </Table>
                        </Grid.Column>
                        </Grid>
                        
                        </div>
                 : "" }
                 {this.state.error ?
                    <Message negative>
                        <Message.Header>GPU price data not found</Message.Header>
                        <p>We couldn't find any price data on {this.state.gpu_name}. Please verify that you entered a valid GPU name.</p>
                    </Message>
                 : ""}
                 {this.state.loading ?
                    <Dimmer active inverted>
                        <Loader size='medium'>Loading</Loader>
                    </Dimmer>
                 : ""}
            </Container>
        );
  }
}

export default App;

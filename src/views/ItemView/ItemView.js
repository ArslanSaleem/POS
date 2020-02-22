import React, { Component } from 'react';
import { Button, Row, Col, Container } from 'reactstrap'
import { addItem } from '../../actions/index'
import {bindActionCreators} from 'redux'
import { connect } from "react-redux";
import { Provider } from "react-redux";
import store from "../../store/index";
import ThemeColor from "./ThemeColor";
import ThemeView from "./ThemeView";

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addItem}, dispatch);
}
async function getUpdateItems(id){
  fetch("http://127.0.0.1:8080/pos/inventory/get?category="+id).then(
      results => {
        return results.json()
      }
    ).then(data=>{
      this.setState({items: data.data[id]});
      let categoriesData = updateUI();
      this.setState({categoriesUI: categoriesData});
      this.forceUpdate();
    });
}
function updateUI(){
  let elements;
  let categoriesData = [];
    if (!this.state.items){
      return <h1>No Item found in this category</h1>
    }
    let distinctCategory = [...new Set(this.state.items.map(x=>x.category))];
    for (let category of distinctCategory.values()){
      elements = [];
      this.state.items.forEach(function (item){

          if (item.category == category){
            elements.push(
              <Provider store={store}>
                <ThemeColor name={item.item_name} id={item.id} className={item.image} category={category} flavor={item.attributes} price={item.price}/>
              </Provider>
            )
          }
      });
      categoriesData.push(
            <Col >
               {elements}
            </Col>
      );

    }
    return elements
}



class ItemView extends Component {

  constructor(props){
    super(props);
    this.state = {items:[], categoriesUI: [], lastId:-1};
    getUpdateItems = getUpdateItems.bind(this)
    updateUI = updateUI.bind(this)
  }

  async componentWillMount(){
    this.timerID = setInterval(
      () => getUpdateItems(this.props.match.params.id),
      5000
    );
  }
  componentWillUnmount() {
    this.setState({categoriesUI: []});
    this.setState({items: []});
    clearInterval(this.timerID);
  }
  render() {
    if (this.state.lastID !== this.props.match.params.id){
      getUpdateItems(this.props.match.params.id);
      this.setState({lastID: this.props.match.params.id});
    }
    return (
      <Container className="animated fadeIn">
        <Row>
          {this.state.categoriesUI}
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return { items: state.items,
    totalPrice: state.totalPrice,
    addedItems:state.addedItems,
    numOfItems: state.numOfItems};
};

export default connect(mapStateToProps, mapDispatchToProps) (ItemView) ;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Button, Row, Col } from 'reactstrap'
import { addItem } from '../../../actions/index'
import {bindActionCreators} from 'redux'
import { connect } from "react-redux";
import { Provider } from "react-redux";
import store from "../../../store/index";
import ThemeColor from "./ThemeColor";

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addItem}, dispatch);
}

export function getUpdateItems(){
  fetch("http://127.0.0.1:8080/pos/inventory/get").then(
      results => {
        return results.json()
      }
    ).then(data=>{
      this.setState({items: data.data})
    });
}

class Colors extends Component {

  constructor(props){
    debugger
    console.log(props);
    super(props);
    this.state = {items:[]}
    getUpdateItems = getUpdateItems.bind(this)
  }

  componentWillMount(){
    getUpdateItems();
  }
  render() {

    var elements = []

    var addToCart = this.props.addToCart;

    var categoriesData = []

    var distinctCategory = [...new Set(this.state.items.map(x=>x.category))]

    for (const category of distinctCategory.values()){

      elements = []

      this.state.items.forEach(function (item){
          if (item.category == category){
            elements.push(
              <Provider store={store}>
                <ThemeColor id={item.id} className={item.image} category={category} flavor={item.flavor} price={item.price}>
                  <h6>{item.flavor}</h6>
                </ThemeColor>
              </Provider>
            )
          }

      });

      categoriesData.push(
            <div className="card">
              <div className="card-header">
                  <i className="icon-drop"></i> {category}
              </div>
              <div className="card-body">
                <Row>
                    {elements}
                </Row>
              </div>
            </div>
      );

    }

    return (

      <div className="animated fadeIn">
          {categoriesData}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { items: state.items,
    totalPrice: state.totalPrice,
    addedItems:state.addedItems,
    numOfItems: state.numOfItems};
};

export default connect(mapStateToProps, mapDispatchToProps) (Colors) ;

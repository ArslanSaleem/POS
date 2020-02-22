import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Button, Row, Col } from 'reactstrap'
import { connect } from "react-redux";
import { addItem } from '../../../actions/index'
import {bindActionCreators} from 'redux'
import {getUpdateItems} from './Colors'


function mapDispatchToProps(dispatch) {
  return bindActionCreators({addItem}, dispatch);
}

class ThemeView extends Component {
    constructor(props) {
      super(props);
      this.state = {
        bgColor: 'rgb(255, 255, 255)',
      }
      this.handleCart = this.handleCart.bind(this);
    }
  
    componentDidMount () {
      const elem = ReactDOM.findDOMNode(this).parentNode.firstChild
      const color = window.getComputedStyle(elem).getPropertyValue('background-color')
      this.setState({
        bgColor: color || this.state.bgColor
      })
    }
  
    handleCart(){
      var item = {
        "Id": this.props.id,
        "Image": this.props.colorName,
        "flavor": this.props.flavor,
        "price": this.props.price
      }
      this.props.addItem({category:this.props.category, item:item});
      getUpdateItems()
    }
  
    render() {
  
      return (
        <Button block color="primary" onClick={this.handleCart}>Add To Cart</Button>
      )
    }
  }

  const mapStateToProps = state => {
    return { items: state.items,
      totalPrice: state.totalPrice,
      addedItems:state.addedItems,
      numOfItems: state.numOfItems};
  };
  

export default connect(mapStateToProps, mapDispatchToProps) (ThemeView);


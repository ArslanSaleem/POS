import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Button, Row, Col } from 'reactstrap'
import ThemeView from "./ThemeView";
import { connect } from "react-redux";
import { addItem } from '../../../actions/index'
import {bindActionCreators} from 'redux'

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addItem}, dispatch);
}

class ThemeColor extends Component {

    constructor(props) {
      super(props);
    }
  
    render() {
  
      // const { className, children, ...attributes } = this.props
      const { className, children } = this.props
  
      const classes = classNames(className, 'theme-color w-75 rounded mb-3')
  
      return (
        <Col xl="2" md="4" sm="6" xs="12" className="mb-4">
          <div className={classes} style={{paddingTop: '75%'}}></div>
          {children}
          <ThemeView category={this.props.category} id={this.props.id} colorName={this.props.className} flavor={this.props.flavor} price={this.props.price}/>
        </Col>
      )
    }
  }

  const mapStateToProps = state => {
    return { items: state.items,
      totalPrice: state.totalPrice,
      addedItems:state.addedItems,
      numOfItems: state.numOfItems};
  };
  

  
export default connect(mapStateToProps, mapDispatchToProps) (ThemeColor);

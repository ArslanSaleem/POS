import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Button, Row, Col } from 'reactstrap'
import ThemeView from "./ThemeView";
import { connect } from "react-redux";
import { addItem } from '../../actions/index'
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
      // const { className, children } = this.props
      //
      // const classes = classNames('theme-color w-75 rounded mb-3');

      return (
        <ThemeView name={this.props.name} category={this.props.category} id={this.props.id} image={this.props.className} flavor={this.props.flavor} price={this.props.price}/>
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

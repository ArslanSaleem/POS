import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Row, Col } from 'reactstrap'
import {connect, Provider} from "react-redux";
import { addItem } from '../../actions/index'
import {bindActionCreators} from 'redux'
import classNames from "classnames";

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addItem}, dispatch);
}

class ThemeView extends Component {
    constructor(props) {
      debugger
      super(props);
      this.state = {
        bgColor: 'rgb(255, 255, 255)',
        item_attributes: {}
      };
      this.handleCart = this.handleCart.bind(this);
    }

    componentDidMount () {
      // const elem = ReactDOM.findDOMNode(this).parentNode.firstChild
      // const color = window.getComputedStyle(elem).getPropertyValue('background-color')
      // this.setState({
      //   bgColor: color || this.state.bgColor
      // })
    }

    handleCart(){
      debugger
      var item = {
        "Id": this.props.id,
        "Image": this.props.image,
        "flavor": this.props.flavor,
        "price": this.props.price,
        "name": this.props.name,
        "attributes": this.state.item_attributes[this.props.id]
      };
      this.props.addItem({category:this.props.category, item:item});
      //getUpdateItems()
    }

    handleRadioBtn(event, item_id, key) {
      let attributes = this.state.item_attributes;
      if (!(item_id in attributes)){
          attributes[item_id] = {};
          attributes[item_id][key] = "";
      }
      attributes[item_id][key] = event.target.value;
      this.setState({item_attributes: attributes});
    }

    render(){
      let categories = [];
      let jsonList = JSON.parse(this.props.flavor);


      for (let key in jsonList) {
        let radioBtn = [];
        for (let listIndex in jsonList[key].options){
          radioBtn.push(
            <li>
                <input type="radio" value={jsonList[key].options[listIndex]} name="gender"
                       onChange={(e)=>this.handleRadioBtn(e, this.props.id, jsonList[key].key)}/>
                {jsonList[key].options[listIndex]}
                <br/>
            </li>

          );
        }
        categories.push(
          <form>
                <b>{jsonList[key].key}</b>
                <ul> {radioBtn} </ul>
          </form>

        );
      }

      return (
         <div style={{height: 400, width: 200 , margin:5, display: "inline-block", backgroundColor: "#ffffff"}}>
           <div style={{margin:20}}>
            <img src={this.props.image} alt={this.props.id} style={{width: 150, height: 150}}/>
             <b>Price:</b> {this.props.price}
            <h5>{this.props.name}</h5>
            {categories}
            <Button color="primary" onClick={this.handleCart} style={{width: 150, height: 50}}>Add To Cart</Button>
           </div>
         </div>
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


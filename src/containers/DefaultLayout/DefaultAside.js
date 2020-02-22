import React, { Component } from 'react';
import { Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup, ListGroupItem, Table, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { removeItem, updatePrice, resetCart } from '../../actions/index'
import {bindActionCreators} from 'redux'
import ReactSnackBar from "react-js-snackbar";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultAside extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      activeTab: '1',
      show: false
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  removeItem(item){
    this.props.removeItem(item)
  }

  updatePrice(e, i){
      let item = {item:{Id: this.props.addedItems[i].Id, price:e.target.value}};
      this.props.updatePrice(item)
  }

  handleCart() {
    let cartItems = [];
    for (var i = 0; i < this.props.addedItems.length; i++) {
      let added_item = this.props.addedItems[i];
      debugger
      cartItems.push({
        "price": added_item.price,
        "item": added_item.Id,
        "attributes": added_item.attributes,
        "quantity": added_item.quantity
      })
    }
    let cart = {
      "total_price": this.props.totalPrice,
      "items": cartItems
    };
    let self = this;
    fetch('http://127.0.0.1:8080/pos/order/place', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cart)
    }).then(res => {
      if (res.status == 200) {
        self.setState({show:true});
        setTimeout(() => {
            self.setState({ show: false});
       }, 2000);
        this.props.resetCart();
      }
    });
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    var elements =[];

    for(let key=0;key<this.props.addedItems.length;key++){

      let added_item = this.props.addedItems[key];
      elements.push(
      <tr>
        <td>{this.props.addedItems[key].name}</td>
        <td>{this.props.addedItems[key].quantity}</td>
        <td><input value={this.props.addedItems[key].price} onChange={(e)=>this.updatePrice(e, key)}/></td>
        <td><Button block color="danger" onClick={()=>this.removeItem(added_item)}>X</Button></td>
      </tr>
      )
    }

    return (
      <React.Fragment>
        <ReactSnackBar Icon={<span>🦄</span>} Show={this.state.show}>
          Order placed Successfully!
        </ReactSnackBar>
        <TabContent activeTab={this.state.activeTab} >
          <TabPane tabId="1">
            <ListGroup className="list-group-accent" tag={'div'}>

              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Cart Items</ListGroupItem>
              <Table responsive>
              <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>remove</th>
                  </tr>
              </thead>
              <tbody>
                  {elements}
                  <tr>
                    <th>Total Price</th>
                    <th> </th>
                    <th><ListGroupItem className="list-group-item-accent-success list-group-item-divider">{this.props.totalPrice}</ListGroupItem></th>
                  </tr>
              </tbody>
              </Table>
              <Button block color="primary" onClick={()=> this.handleCart()}>Buy</Button>
            </ListGroup>
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({removeItem, updatePrice, resetCart}, dispatch);
}

const mapStateToProps = state => {
  return { items: state.items,
    totalPrice: state.totalPrice,
    addedItems:state.addedItems,
    numOfItems: state.numOfItems};
};

// function updatepPurchaseItemPrice(dispatch){
//   return bindActionCreators({updatePrice}, dispatch);
// }

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps) (DefaultAside);

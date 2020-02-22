import React, { Component, } from 'react';
import {Card, Button, CardHeader, CardBody, Table, Pagination, PaginationItem, PaginationLink} from 'reactstrap';

class ItemViewDialogBox extends Component {

    constructor(props) {
      super(props);
    }

    render() {

      let itemData = [];
      for (let index=0; index<this.props.itemsData.length; index++){
        let record = this.props.itemsData[index];
        if (record.order_no === this.props.orderNo){
          itemData.push(
            <tr>
              <td>{record.item}</td>
              <td>{record.quantity}</td>
              <td>{record.price}</td>
              <td>{record.attributes}</td>
            </tr>
          )
        }
      }

      return (<div>
        <Card>
          <CardHeader>
              <i className="fa fa-align-justify"></i> Order Number {this.props.orderNo}
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                  <tr>
                    <th>Item Id</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Attributes</th>
                  </tr>
                  </thead>
                  <tbody>
                  {itemData}
                  </tbody>
                </Table>
              </CardBody>
        </Card>
        <Button color="danger" onClick={this.props.onClose}>Close</Button>
      </div>);
    }
}

export default ItemViewDialogBox;

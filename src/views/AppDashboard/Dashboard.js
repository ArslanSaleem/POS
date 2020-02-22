import React, { Component, lazy, Suspense } from 'react';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { Bar, Line } from 'react-chartjs-2';
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle, Pagination, PaginationItem, PaginationLink,
  Progress,
  Row,
  Table,
} from 'reactstrap';
import ItemViewDialogBox from '../../views/AppDashboard/ItemViewDialog';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      salesData: [],
      tableData: [],
      renderItemViewDialog: false,
      selectedOrder: null
    };
  }
  getTableData(){
    fetch("http://127.0.0.1:8080/pos/sales/get").then(
      results => {
        return results.json()
      }
    ).then(data=>{
      this.setState({salesData: data.data});
      let iteratedId=[];
      let tableRows = []
      for (let saleData=0; saleData < data.data.length; saleData++){
        debugger
        let rowData = data.data[saleData];
        if (!(iteratedId.includes(rowData.order_no))){
          iteratedId.push(rowData.order_no);
          tableRows.push(<tr>
            <td> {rowData.order_no}</td>
            <td> {rowData.date}</td>
            <td> {rowData.total}</td>
            <td> <Button color="primary" onClick={()=>this.handleItemViewButton(rowData.order_no)}>View</Button></td>
          </tr>)
        }
      }
      this.setState({tableData: tableRows});
    });
  }
  handleItemViewButton(orderNo){
    this.setState({renderItemViewDialog: true});
    this.setState({selectedOrder: orderNo});
  }

  componentDidMount() {
    this.getTableData();
    this.tableDataInterval = setInterval(
      () => this.getTableData(),
      5000
    );
  }
  componentWillUnmount() {
    clearInterval(this.tableDataInterval);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn">
         <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Sales
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                  <tr>
                    <th>Order no</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Items</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.tableData}
                  </tbody>
                </Table>
                <Pagination>
                  <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                  <PaginationItem active>
                    <PaginationLink tag="button">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
        <Dialog isOpen={this.state.renderItemViewDialog} >
           <ItemViewDialogBox orderNo={this.state.selectedOrder} itemsData={this.state.salesData} onClose={()=>this.setState({renderItemViewDialog: false})}/>
        </Dialog>
      </div>
    );
  }
}

export default Dashboard;

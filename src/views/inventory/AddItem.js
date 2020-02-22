import {
  Badge,
  Button, Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label
} from "reactstrap";
import React, { Component } from 'react';
import axios from 'axios';
import ReactSnackBar from "react-js-snackbar";

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {name:"", price:0, quantity:0, image:null, category:"", attributes: [], dropdownList:[(<option>Select Item</option>)],
    show:false};
  }

  componentWillMount(){
    fetch("http://127.0.0.1:8080/pos/categories/get").then(
      results => {
        return results.json()
      }
    ).then(data=>{
      let options= [];
      debugger
      for (var idx in data.data){
        options.push(<option value={data.data[idx].id}>{data.data[idx].name}</option>)
      }
      this.setState({dropdownList: options, category: data.data[idx].id});
    });
  }

  addAttribute = (e) => {
    this.setState((prevState) => ({
      attributes: [...prevState.attributes, {key:"", options:[]}],
    }));
  };
  addOption = (idx) => {
    let attributes = this.state.attributes;
    attributes[idx].options.push("");
    this.setState({
      attributes: attributes
    });
  };

  updateAttributeKey(e, idx){
    let attributes = this.state.attributes;
    attributes[idx].key = e.target.value;
    this.setState({
      attributes: attributes
    });
  }
  updateOptionValue(e, itemId, idx){
    let attributes = this.state.attributes;
    attributes[itemId].options[idx] = e.target.value;
    this.setState({
      attributes: attributes
    });
  }

  updateName(e){
    debugger
    let val = e.target.value;
    this.setState({
      name: val
    });
  }
  updatePrice(e){

    this.setState({
      price: e.target.value
    });
  }

  updateQuantity(e){
    this.setState({
      quantity: e.target.value
    });
  }

  updateCategory(e){
    this.setState({
      category: e.target.value
    });
  }

  updateImage(e){
    this.setState({
      image: e.target.files[0]
    });
  }

  handleDropDown(e){
    this.setState({
      category: e.target.value
    });
  }
  onReset(){
    this.setState({
      name:"", price:0, quantity:0, image:null, category:0, attributes: []
    });
  }

  onSubmitForm(){
    const data = new FormData();
    data.append("myFile", this.state.image, this.state.image.name);
    data.append("item_name", this.state.name);
    data.append("category", parseInt(this.state.category));
    data.append("quantity", parseInt(this.state.quantity));
    data.append("price", parseInt(this.state.price));
    data.append("attributes", JSON.stringify(this.state.attributes));
    let self = this;
    axios.post('http://127.0.0.1:8080/pos/inventory/add', data).then(function (response) {
    // handle success
        self.setState({show:true});
        setTimeout(() => {
            self.setState({ show: false});
       }, 2000);
  });
  }

  render() {


    return (<Card>
      <CardHeader>
        <strong>Add items to inventory</strong>
      </CardHeader>
      <CardBody>
        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">

          <FormGroup row>
            <Col d="3">
              <Label htmlFor="text-input">Name</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="text-input" name="text-input" placeholder="Text" value={this.state.name} onChange={(e)=> this.updateName(e)}/>
              <FormText color="muted">Please enter item name</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
                <Col md="3">
                   <label htmlFor="text-input">Category</label>
                </Col>
                <Col xs="12" md="9">
                  <select name="customSearch" className="custom-search-select" value={this.state.category} onChange={(e) => this.handleDropDown(e)}>
                        {this.state.dropdownList}

                  </select>
                </Col>
              </FormGroup>
          <FormGroup row>
            <Col d="3">
              <Label htmlFor="text-input">Price</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="text-input2" name="text-input" placeholder="Text" value={this.state.price} onChange={(e)=> this.updatePrice(e)}/>
              <FormText color="muted">Please enter item price</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col d="3">
              <Label htmlFor="text-input">Quantity</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="text-input3" name="text-input" placeholder="Text" value={this.state.quantity} onChange={(e)=> this.updateQuantity(e)}/>
              <FormText color="muted">Please enter item quantities</FormText>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col md="3">
              <Label htmlFor="file-input">Image</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="file" id="file-input" name="file-input" onChange={(e)=> this.updateImage(e)}/>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col md="3">
              <Label htmlFor="password-input">Attributes</Label>
            </Col>
            <Col xs="12" md="9">
              <Button onClick={this.addAttribute}>Add new attribute</Button>
            </Col>
          </FormGroup>
             {
          this.state.attributes.map((val, idx)=> {
            let catId = `name-${idx}`, ageId = `options-${idx}`
            return (
              <div>
              <FormGroup row>
                <Col md="3">
                   <label htmlFor={catId}>Attribute name </label>
                </Col>
                <Col xs="12" md="9">
                <input
                  type="text"
                  name={catId}
                  data-id={idx}
                  id={catId}
                  className="name"
                  onChange={(e) => this.updateAttributeKey(e, idx)}
                />
                </Col>
               </FormGroup>
              <FormGroup row>
                <Col md="3">
                   <label htmlFor={ageId}>Options &nbsp;</label>
                </Col>
                <Col xs="12" md="9">
                  <Button onClick={() => this.addOption(idx)}>Add Option</Button>
                  {
                 val.options.map((val2, idx2)=> {
                   let optionId='Option#'+ idx2;
                   return(
                     <FormGroup row>
                       <Col xs="12" md="9">
                       <input
                        type="text"
                        name={optionId}
                        data-id={idx2}
                        id={optionId}
                        className="options"
                        onChange={(e) =>this.updateOptionValue(e, idx, idx2)}
                      />
                       </Col>
                     </FormGroup>
                    )
                 })
                 }
                </Col>
              </FormGroup>
              </div>
            )
          })
        }



        </Form>
      </CardBody>
      <CardFooter>
        <Button type="submit" size="sm" color="primary" onClick={(e) => this.onSubmitForm(e)}><i className="fa fa-dot-circle-o"></i> Submit</Button>
        <Button type="reset" size="sm" color="danger" onClick={() => this.onReset()}><i className="fa fa-ban"></i> Reset</Button>
      </CardFooter>
      <ReactSnackBar Icon={<span>🦄</span>} Show={this.state.show}>
          Successfully! added item to inventory
      </ReactSnackBar>
    </Card>);
  }
}

export default AddItem;

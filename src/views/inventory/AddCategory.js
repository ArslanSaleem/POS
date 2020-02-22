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
import axios from "axios";
import ReactSnackBar from "react-js-snackbar";

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {name:"", attributes: [], show:false};
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


  onReset(){
    this.setState({
      name:"", attributes: []
    });
  }

  onSubmitForm(){
    // let submitData = {
    //   "name": this.state.name,
    //   "attributes": this.state.attributes
    // };
    const data = new FormData();
    data.append("name", this.state.name);
    data.append("attributes", JSON.stringify(this.state.attributes));
    let self  = this;
    axios.post('http://127.0.0.1:8080/pos/category/add', data).then(function (response) {
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
        <strong>Add Category</strong>
      </CardHeader>
      <CardBody>
        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
          <FormGroup row>
            <Col d="3">
              <Label htmlFor="text-input">Name</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="text-input" name="text-input" placeholder="Text" value={this.state.name} onChange={(e)=> this.updateName(e)}/>
              <FormText color="muted">Please enter category name</FormText>
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
          Successfully! added new category
      </ReactSnackBar>
    </Card>);
  }
}

export default AddCategory;

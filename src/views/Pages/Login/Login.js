import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {userName: '', password: '', errorTxt: false};
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(name, event){
    this.setState({[name]: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.userName=="arslan" && this.state.password=="Halo"){
      this.setState({errorTxt: false});
      this.props.history.push('/dashboard')
    }else{
      this.setState({errorTxt: true});
    }
    event.preventDefault();
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" onChange={(e) => this.onInputChange("userName", e)} value={this.state.userName}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" onChange={(e) => this.onInputChange("password", e)} value={this.state.password}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary"  onClick={this.handleSubmit} >Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                        <div>
                            { this.state.errorTxt ? <ErrorTxt /> : null }
                        </div>
    
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}


class ErrorTxt extends Component{
  render(){
    return <div className="text-muted">
      Invalid password try again!!!
      </div>
                      
  }
}

export default Login;

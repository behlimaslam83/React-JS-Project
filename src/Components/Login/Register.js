import React, { Component } from 'react';
import './Login.scss';
import { Form, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Register = (props) => {
  const { fromChildComp } = props;
  return (
        <Form>
          <Form.Group className="text-center">
          LOGIN
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Control size="sm" type="text" placeholder="First Name" />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Control size="sm" type="text" placeholder="Last Name" />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Control size="sm" type="email" placeholder="Email Address" />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Control size="sm" type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Control size="sm" type="password" placeholder="Confirm Password" />
          </Form.Group>
          <Button variant="warning" size="sm" block type="submit">Create Account</Button>
          <Form.Group className="text-center">
        <Form.Label>Alread have an account ? <a onClick={fromChildComp} href="javascript:;">Sign in</a></Form.Label>
          </Form.Group>
        </Form>
        
  );
}

export default Register;
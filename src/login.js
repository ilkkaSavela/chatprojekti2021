import React, {useState} from 'react';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';

let json;
let tokenKey = 'myToken';
const Login = () => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [validated, setValidated] = useState(false);

  const handleEmailChange = (event) => {
    console.log(event.target.value);
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    console.log(event.target.value);
    setNewPassword(event.target.value);
  };

  const handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    event.preventDefault();
    event.stopPropagation();
    const userObject = {
      email: newEmail,
      password: newPassword,
    };

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 202) {
        json = JSON.parse(xmlhttp.responseText);
        console.log(json);
        if (json.accessToken !== null) { // something found
          localStorage.setItem(tokenKey, json.accessToken);
          console.log('Käyttäjä löydetty! ' + json.accessToken);
        } else {
          xmlhttp.open('POST', 'http://localhost:8080/api/register', true);
          xmlhttp.setRequestHeader('Content-Type', 'application/json');
          xmlhttp.send(JSON.stringify(userObject));
        }
      }
    };

    xmlhttp.open('GET',
        'http://localhost:8080/api/login?email=' + newEmail + '&password=' +
        newPassword, true);
    xmlhttp.send();

    setValidated(true);
  };

  return (
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email address:</Form.Label>
  <Form.Control type="email" value={newEmail}
  onChange={handleEmailChange} required/>
  <Form.Control.Feedback type="invalid">Please enter a valid
  email!</Form.Control.Feedback>
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password:</Form.Label>
  <Form.Control type="password" value={newPassword}
  onChange={handlePasswordChange} required/>
  <Form.Control.Feedback type="invalid">Please enter a valid
  password!</Form.Control.Feedback>
  </Form.Group>
  <Button variant="primary" type="submit">
      Submit
      </Button>
      </Form>
);
};

export default Login;
//import './landingpage.css';
import
React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import * as PropTypes from 'prop-types';


let json;
let tokenKey = 'myToken';

class Redirect extends React.Component {
  render() {
    return null;
  }
}

Redirect.propTypes = {to: PropTypes.string};
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

  const validityChecker = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("invalid")
      event.preventDefault();
      event.stopPropagation();
    }else {
      handleSubmit(event)
    }
    setValidated(true);

  }

  const handleSubmit = event => {
    console.log('lähetetään lomake')
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
          alert('Kirjauduttu');
          window.location.href = '/chat'

        } else {
          xmlhttp.open('POST', 'http://localhost:8080/api/register', true);
          xmlhttp.setRequestHeader('Content-Type', 'application/json');
          xmlhttp.send(JSON.stringify(userObject));
          alert('Käyttäjä luotu');
          window.location.href = '/chat'
        }
      }
    };

    xmlhttp.open('GET',
        'http://localhost:8080/api/login?email=' + newEmail + '&password=' +
        newPassword, true);
    xmlhttp.send();

    setValidated(true);
    event.preventDefault();
  };

  return (

      <div className="bg-image">
        <Helmet>
          <link rel="stylesheet" href="/css/landingpage.css" />
        </Helmet>
        <div id="header">
          <img alt="" src="/img/logo_transparent.png"/>
          <div className="dropdown">
            <div id="chat_drop_button"><img alt=""
                src="./img/iconfinder_multimedia-24_2849812.png"/></div>
            <div id="dropdown_content">
              <a href="/chat">Chat-sivu</a>
            </div>
          </div>
        </div>

        <div id="main">
          <div id="facts">
            <h1 id="text">Hei, <br/> tervetuloa käyttämään chat-sovellusta.
              Aloita käyttäminen kirjoittamalla oma sähköposti osoitteesi sekä haluamasi salasana sivulle, jonka jälkeen sinut ohjataan chat-sivulle. </h1>
          </div>
          <div id="log">
          <Form noValidate validated={validated} onSubmit={validityChecker}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Sähköposti:</Form.Label>
              <Form.Control type="email" value={newEmail}
                            onChange={handleEmailChange} required/>
              <Form.Control.Feedback type="invalid">Anna oikea sähköposti osoite!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Salasana:</Form.Label>
              <Form.Control type="password" value={newPassword}
                            onChange={handlePasswordChange} required/>
              <Form.Control.Feedback type="invalid">Väärä salasana</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
          </div>
        </div>
        <div id="author">
          <img className="picture" alt="" src="/img/Kuva_Elias.jpeg"/>
            <img className="picture" alt="" src="img/kuva_ilkka.jpeg"/>
              <img className="picture" alt="" src="img/Kuva_Aleksi.jpeg"/>
        </div>
      </div>
);
};
export default Login
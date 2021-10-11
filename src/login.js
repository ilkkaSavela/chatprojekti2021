import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
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
  const [logged, setLogged] = useState(() => {
    return localStorage.getItem(
        'myToken') !== null;
  });

  // käsittelee sähköpostin vaihdon
  const handleEmailChange = (event) => {
    console.log(event.target.value);
    setNewEmail(event.target.value);
  };

  // käsittelee salasanan vaihdon
  const handlePasswordChange = (event) => {
    console.log(event.target.value);
    setNewPassword(event.target.value);
  };

  //katsoo onko validointi kunnossa ja jos on päästää läpi
  const validityChecker = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log('invalid');
      event.preventDefault();
      event.stopPropagation();
    } else {
      handleSubmit(event);
    }
    setValidated(true);

  };

//käsittelee lähetyksen ja tarkistaa onko käyttäjää ja jos ei ole tekee sen ja päästää sitten chat sivulle
  const handleSubmit = event => {
    console.log('lähetetään lomake');
    const userObject = {
      email: newEmail,
      password: newPassword,
    };

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        console.log(xmlhttp.status);

        switch (xmlhttp.status) {
          case 201: //Uusi käyttäjä
            json = JSON.parse(xmlhttp.responseText);
            console.log(json);
            if (json.accessToken !== null) { // something found
              localStorage.setItem(tokenKey, json.accessToken);
              localStorage.setItem('userID', json.userID);
              console.log('Käyttäjä luotu! ' + json.accessToken);
              alert('Käyttäjä luotu');
              window.location.href = '/chat';
            }
            break;
          case 202: // Kirjauduttu
            json = JSON.parse(xmlhttp.responseText);
            console.log(json);
            if (json.accessToken !== null) { // something found
              localStorage.setItem(tokenKey, json.accessToken);
              localStorage.setItem('userID', json.userID);
              console.log('Käyttäjä löydetty! ' + json.accessToken);
              alert('Kirjauduttu');
              window.location.href = '/chat';
            }
            break;
          case 400: // Käyttäjän luonti ei onnistunut
            alert('Virhe!');
            break;
          case 401: // Väärä salasana
            console.log('väärä salasana');
            alert('Väärä salasana');
            break;

          default:

        }

      }
    };

    xmlhttp.open('POST', 'http://localhost:8080/api/login', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(userObject));
    setValidated(true);
    event.preventDefault();
  };

  return (

      <div className="bg-image">
        <Helmet>
          <link rel="stylesheet" href="/css/landingpage.css"/>
        </Helmet>
        <div id="header">
          <img alt="" src="/img/logo_transparent.png"/>
          <div className="dropdown">
            <div id="chat_drop_button"><img alt=""
                                            src="./img/iconfinder_multimedia-24_2849812.png"/>
            </div>
            <div id="dropdown_content">
              <a href="/chat">Chat-sivu</a>
            </div>
          </div>
        </div>

        <div id="main">
          <div id="facts">
            <h1 id="text">Hei, <br/> tervetuloa käyttämään chat-sovellusta.
              Aloita käyttäminen kirjoittamalla oma sähköpostiosoitteesi sekä
              haluamasi salasana sivulle. Tämän jälkeen sinut ohjataan automaattisesti chat-sivulle. </h1>
          </div>
          <div id="log">
            <div style={{display: logged ? 'block' : 'none'}}>
              <h2>Olet kirjautunut sisään käyttäjänä {localStorage.getItem(
                  'userID')}!</h2>
              <Button onClick={() => {
                localStorage.clear();
                setLogged(false);
                alert('Olet kirjautunut ulos!');
              }}>Kirjaudu ulos</Button>
            </div>

            <Form style={{display: logged ? 'none' : 'block'}} id="loginForm"
                  noValidate validated={validated} onSubmit={validityChecker}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Sähköposti:</Form.Label>
                <Form.Control type="email" value={newEmail}
                              placeholder="Anna sähköposti"
                              onChange={handleEmailChange} required/>
                <Form.Control.Feedback type="invalid">Anna oikea sähköposti
                  osoite! </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Salasana:</Form.Label>
                <Form.Control type="password" value={newPassword}
                              placeholder="salasana"
                              onChange={handlePasswordChange} required/>
                <Form.Control.Feedback type="invalid">Väärä
                  salasana</Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit">
                Kirjaudu
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
export default Login;
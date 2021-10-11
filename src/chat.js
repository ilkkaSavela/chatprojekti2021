//import './chatstyle.css';
import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Button, Form} from 'react-bootstrap';
import axios from 'axios';

const Chat = () => {


  const contact_view = document.getElementById('contacts');
  let contactslist = [];
  let content;
  let contact;

  const [newMessage, setNewMessage] = useState('');
  const [validated, setValidated] = useState(false);
  const [contents, setContents] = useState([]);
  const [receiver, setReceiver] = useState(contact);


  const getMessages = () => {
    axios.get('http://127.0.0.1:8080/api/messages',{params:{token: localStorage.getItem('myToken')}}
    ).then(response => {
      const res = (response.request.responseText);
      console.log(res);
      contactsToScreen(res);
      messagesToScreen(res, undefined);
    });

  };

  const contactsToScreen = (res) => {
    let test = JSON.parse(res);
    let memo=[];
    for(let x = 0; x < test.length; x++){
      if((test[x].message.receiver===Number(localStorage.getItem('userID')))){
        memo.push(test[x].message.sender);
      }else if((test[x].message.receiver!==Number(localStorage.getItem('userID')))){
        memo.push(test[x].message.receiver);
      }
    }
    contactslist=[...new Set(memo)];
    if((document.getElementsByClassName('contactbar')).length===0) {
      contactslist.map(result => {

            const contactbar = document.createElement('div');
            contactbar.className = 'contactbar';
            contactbar.addEventListener('click', () => {
              if (content) {
                messagesToScreen(content, Number(result));
              }
              setReceiver(Number(result));
              const lista = document.getElementsByClassName('contactbar-selected');
              for (let i = 0; i < lista.length; i++) {
                lista[i].className = 'contactbar';
              }
              contactbar.className = 'contactbar-selected'
              contactbar.id = 'contactbar-selected'
            });
            const contactName = document.createElement('h4');
            contactName.innerText = result;
            contactbar.appendChild(contactName);
            document.getElementById('contacts').appendChild(contactbar);
          }
      );
    }

  }


  const messagesToScreen = (res, lastcontact) => {
    if (lastcontact) {
      contact = lastcontact;
    }
    if(res) {
      let test = JSON.parse(res);

      setContents(test);
      for (let i = 0; i < test.length; i++) {
        if (test[i].sender === 2) {
          test[i].sender = 'sentmessages';
        } else {
          test[i].sender = 'receivedmessages';
        }
      }
      setContents(test);
      setContents(test);

       //gotoBottom();
    }
  };

  useEffect(() => {
    console.log('Execute useEffect');
    getMessages()
  },[]);

  const validityChecker = (event) => {
    console.log('Validity check start');
    const form = event.currentTarget;
    console.log(form.checkValidity());
    if (newMessage === '') {

      event.preventDefault();
      event.stopPropagation();
    } else {
      handleSendingMessage(event);

    }
    setValidated(true);

  };
  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendingMessage = (event) => {
    event.preventDefault()
    console.log('Lähetetään viesti: ' + newMessage);
    if ((newMessage !== '')) {
      console.log('Lähetetään viesti: ' + newMessage);
      const messageObject = {
        token: localStorage.getItem('myToken'),
        receiver: receiver,
        message: newMessage,
      };
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 202) {
          getMessages();
        }
      };
      xmlhttp.open('POST',
          'http://127.0.0.1:8080/api/messages', true);
      xmlhttp.setRequestHeader('Content-Type', 'application/json');
      xmlhttp.send(JSON.stringify(messageObject));
    }
    setNewMessage('');
  };

  function logout() {
    localStorage.clear();
    window.location.href = '/';
    alert('Olet kirjautunut ulos ja sinut ohjataan etusivulle');
  }

  const new_conv = () => {
    const new_contact = prompt('syötä contactn ID');
    if (new_contact !== '' && new_contact !== null ){
      const contactbar = document.createElement('div');
      contactbar.className = 'contactbar';
      contactbar.addEventListener('click', () => {
        messagesToScreen(content, Number(new_contact));
        setReceiver(Number(new_contact));
        const lista = document.getElementsByClassName('contactbar-selected');
        for (let i=0;i<lista.length;i++) {
          lista[i].className = 'contactbar';
        }
        contactbar.className = 'contactbar-selected'
        contactbar.id = 'contactbar-selected'
      });
      const contactName = document.createElement('h4');
      contactslist.push(Number(new_contact));
      contactName.innerText = new_contact;
      contactbar.appendChild(contactName);
      contact_view.appendChild(contactbar);}
  }

  return (

      <div className="bg-image">
        <Helmet>
          <link rel="stylesheet" href="/css/chatstyle.css"/>
        </Helmet>
        <div className="dropdown">
          <div id="chat_drop_button"><span>{localStorage.getItem('userID')}</span></div>
          <div id="dropdown_content">
            <a href="/">Etusivu</a>
            <a onClick={logout}>Kirjaudu ulos</a>
          </div>
        </div>

        <div id="chat_history">
          <h4>Edelliset keskustelut</h4>
          <div id="contacts">
          </div>
          <Button id="new_conversation"
              onClick={() => new_conv()}><h3>uusi
            keskustelu</h3></Button>
        </div>
        <div id="messages">
          {contents.map(result => {
            if (Number(result.message.sender) === receiver) {

              return (
                  <div className="receivedmessages"><p>{result.message.message}</p>
                  </div>
              );
            }else if( Number(result.message.receiver) === receiver){
              return (
                  <div className="sentmessages"><p>{result.message.message}</p>
                  </div>
              );
            }else{
              return (
                  <div>
                  </div>
              );
            }
          })}
        </div>
        <div id="new_message">
          <Form noValidate validated={validated} onSubmit={validityChecker}
                id="new_message_form">
            <Form.Group>
              <Form.Control type="text" onChange={handleMessageChange}/>
            </Form.Group>
            <Form.Control id="receiver_sending" name="receiver" type="hidden"
                          value="2"/>
            <Button id="send_new_message" type="submit">Lähetä</Button>
          </Form>
        </div>
      </div>

  );
};

export default Chat;
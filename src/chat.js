//import './chatstyle.css';
import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Button, Form, Table} from 'react-bootstrap';
import axios from 'axios';

let ajettu = false;
let naytettavakontakti = '';

const Chat = () => {

  ////////////////////////////// Testausta
  const send_new_message = document.getElementById('send_new_message');
  const messages_view = document.getElementById('messages');
  const contact_view = document.getElementById('contacts');
  const receiverID_sendmessage = document.getElementById('receiver_sending');
  const newConversation_button = document.getElementById('new_conversation');
  const menu_button = document.getElementById('chat_drop_button');
  const contactslist = [];
  let content;
  let contact;

  ///////////////////////////////////////////

  const [newMessage, setNewMessage] = useState('');
  const [validated, setValidated] = useState(false);
  const [contents, setContents] = useState([]);

  const getMessages = () => {

    /*const request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            //console.log(request.responseText);
            const res = JSON.parse(request.responseText);
            content = res;
            console.log(res);
            contactsToScreen(res);
            messagesToScreen(res, undefined);
            request.open('GET',
                `http://127.0.0.1:8080/api/messages`);
            request.send();
        } else if (request.readyState === 4 && request.status === 204) {
            request.open('GET',
                `http://127.0.0.1:8080/api/messages`);
            request.send();
        }

    };

    request.open('GET',
        `http://127.0.0.1:8080/api/Rmessages`);
    request.send();*/

    axios.get('http://127.0.0.1:8080/api/messages',{params:{token: localStorage.getItem('myToken')}}
    ).then(response => {
      console.log(response.request.responseText);
      const res = (response.request.responseText);
      console.log((res));
      //contactsToScreen(res)
      messagesToScreen(res, 22);
    });

  };

  /*
      const contactsToScreen = (res) => {
          res.map(message => {
              if (Number(message.sender) === 1) {
                  console.log('Message user Id: '+message.userid)
                  //menu_button.innerHTML = `<span style="text-align: center">${message.message.sender}</span>`;
                  if (!contactslist.find(
                      (contact) => contact === message.message.receiver)) {
                      const contactbar = document.createElement('div');
                      contactbar.className = 'contactbar';
                      contactbar.addEventListener('click', () => {
                          messagesToScreen(content, message.message.receiver);
                          receiverID_sendmessage.value = message.message.receiver;
                          const lista = document.getElementsByClassName('contactbar-selected');
                          for (let i=0;i<lista.length;i++) {
                              lista[i].className = 'contactbar';
                          }
                          contactbar.className = 'contactbar-selected'
                      });
                      const contactName = document.createElement('h4');
                      contactslist.push(message.message.receiver);
                      contactName.innerText = message.message.receiver;
                      contactbar.appendChild(contactName);
                      contact_view.appendChild(contactbar);

                  }

              } else if (Number(message.sender) === 2) {
                  //menu_button.innerHTML = `<span style="text-align: center">${message.message.receiver}</span>`;
                  if (!contactslist.find((contact) => contact === message.message.sender)) {
                      const contactbar = document.createElement('div');
                      contactbar.className = 'contactbar';
                      contactbar.addEventListener('click', () => {
                          messagesToScreen(content, message.message.sender);
                          receiverID_sendmessage.value = message.message.sender;
                          const lista = document.getElementsByClassName('contactbar-selected');
                          for (let i=0;i<lista.length;i++) {
                              lista[i].className = 'contactbar';
                          }
                          contactbar.className = 'contactbar-selected'
                      });
                      const contactName = document.createElement('h4');
                      contactslist.push(message.message.sender);
                      contactName.innerText = message.message.sender;
                      contactbar.appendChild(contactName);
                      contact_view.appendChild(contactbar);
                  }
              }

          });
      };
  */
  const messagesToScreen = (res, lastcontact) => {
    naytettavakontakti = lastcontact;
    let test = JSON.parse(res);
    setContents(JSON.parse(res));
    for (var i = 0; i < test.length; i++) {
      if (test[i].sender === 1) {
        test[i].sender = 'sentmessages';
      } else {
        test[i].sender = 'receivedmessages';
      }
    }
    setContents(test);
    console.log(contents);
    // setContents(contents);
    /* console.log('called to messages to screen ')
     if (lastcontact) {
         contact = lastcontact;
     }
     messages_view.innerHTML = '';
     document.getElementById('messages');
     res.map(message => {
         if (Number(message.message.sender) === Number(contact) || Number(message.message.receiver) ===
             Number(contact)) {

             const messagebar = document.createElement('div');
             if (Number(message.sender) === 1) {
                 messagebar.className = 'sentmessages';
             } else if (Number(message.sender) === 2) {
                 messagebar.className = 'receivedmessages';
             }
             const messageText = document.createElement('p');
             messageText.innerText = message.message.message;
             messagebar.appendChild(messageText);
             messages_view.appendChild(messagebar);

         }

     });
     //gotoBottom();
     //getMessages();*/

  };

  useEffect(() => {
    console.log('Exucute useEffect');
    //getUserid();
    if (!(ajettu)) {
      getMessages();
      ajettu = true;
    }

  });

  const validityChecker = (event) => {
    console.log('Validity check start');
    const form = event.currentTarget;
    console.log(form.checkValidity());
    /* if (form.checkValidity() === false) {
          console.log("invalid")
          event.preventDefault();
          event.stopPropagation();
     console.log("Validity: "+newMessage);*/
    if (newMessage === '') {

      event.preventDefault();
      event.stopPropagation();
    } else {

      console.log('handeli kutsuttu: ' + newMessage + validated);
      handleSendingMessage(event);

    }
    setValidated(true);

  };
  const handleMessageChange = (event) => {
    console.log(event.target.value);
    setNewMessage(event.target.value);
  };

  const handleSendingMessage = (event) => {
    event.preventDefault()
    console.log('Lähetetään viesti: ' + newMessage);
    if ((newMessage !== '')) {
      console.log('Lähetetään viesti: ' + newMessage);
      const messageObject = {
        token: localStorage.getItem('myToken'),
        receiver: 53,
        message: newMessage,
      };
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 202) {

          //json = JSON.parse(xmlhttp.responseText);
          //console.log(json);

        }
      };
      xmlhttp.open('POST',
          'http://127.0.0.1:8080/api/messages', true);
      xmlhttp.setRequestHeader('Content-Type', 'application/json');
      xmlhttp.send(JSON.stringify(messageObject));
    }
    ;
    setNewMessage('');
  };

  function logout() {
    localStorage.clear();
    window.location.href = '/';
    alert('Olet kirjautunut ulos ja sinut ohjataan etusivulle');
  }

  const new_conv = () => {
    const new_contact = prompt('syötä kontaktin ID');
    if (new_contact !== '' && new_contact !== null ){
      const contactbar = document.createElement('div');
      contactbar.className = 'contactbar';
      contactbar.addEventListener('click', () => {
        messagesToScreen(content, Number(new_contact));
        receiverID_sendmessage.value = Number(new_contact);
        const lista = document.getElementsByClassName('contactbar-selected');
        for (let i=0;i<lista.length;i++) {
          lista[i].className = 'contactbar';
        }
        contactbar.className = 'contactbar-selected'
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
            return (
                <div className={result.sender}><p>{result.message.message}</p>
                </div>
            );
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
            {//<textarea id="uusiviesti_sisalto" name="message" rows="2" onChange={handleMessageChange} />
            }
            <Button id="send_new_message" type="submit">Lähetä</Button>
          </Form>
        </div>
      </div>

  );
};

export default Chat;
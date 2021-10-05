//import './chatstyle.css';
import React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import {Form} from 'react-bootstrap';

const Chat = () => {

    const [newMessage, setNewMessage] = useState('');
    const [validated, setValidated] = useState(false);


    const validityChecker = (event) => {
        console.log("Validity check start");
        const form = event.currentTarget;
        console.log(form.checkValidity())
        /* if (form.checkValidity() === false) {
              console.log("invalid")
              event.preventDefault();
              event.stopPropagation();
         console.log("Validity: "+newMessage);*/
        if (newMessage === '') {

            event.preventDefault();
            event.stopPropagation();
        } else {

            console.log("handeli kutsuttu: "+newMessage + validated);
            handleSendingMessage(event)

        }
        setValidated(true);

    }
    const handleMessageChange = (event) => {
        console.log(event.target.value);
        setNewMessage(event.target.value);
    };

    const handleSendingMessage = () => {
        console.log("Lähetetään viesti: "+newMessage);
        if((newMessage!=='')){
            console.log("Lähetetään viesti: "+newMessage);
            const messageObject = {
                sender: 1,
                receiver: 2,
                message: newMessage,
            };
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 202) {

                    //json = JSON.parse(xmlhttp.responseText);
                    //console.log(json);


                }
            }
            xmlhttp.open('POST',
                'http://127.0.0.1:8080/api/messages', true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.send(JSON.stringify(messageObject));
        };
        setNewMessage('');
    };




    return (
      <div className="bg-image">
        <Helmet>
          <link rel="stylesheet" href="/css/chatstyle.css"/>
        </Helmet>
        <div className="dropdown">
          <div id="chat_drop_button"><img
              src="./img/iconfinder_multimedia-24_2849812.png"/></div>
          <div id="dropdown_content">
            <a href="/chat">Chat-sivu</a>
          </div>
        </div>

        <div id="chat_history">
          <h4>Edelliset keskustelut</h4>
          <div id="contacts">
          </div>
          <div id="new_conversation">
            <h3>uusi keskustelu</h3>

          </div>
        </div>

        <div id="messages"/>

        <div id="new_message">
          <Form noValidate validated={validated} onSubmit={validityChecker} id="new_message_form">
            <input id="receiver_sending" name="receiver" type="hidden"
                   value="2"/>
            <textarea id="uusiviesti_sisalto" name="message" rows="2" onChange={handleMessageChange} />
            <input id="send_new_message" type="submit"/>
          </Form>
        </div>
      </div>

  );
};
export default Chat;
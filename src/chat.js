//import './chatstyle.css';
import React, {useState} from 'react';
import {Form} from 'react-bootstrap';

const Chat = () => {
  return (
      <div class="bg-image">
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

<div id="messages"> </div>

<div id="new_message">
<form id="new_message_form">
<input id="receiver_sending" name="receiver" type="hidden" value="2"/>
<textarea id="uusiviesti_sisalto" name="message" rows="2" >

</textarea>
<input id="send_new_message" type="submit"/>
</form>
</div>
      </div>

);
};
        export default Chat
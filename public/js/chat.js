'use strict';

const send_new_message = document.getElementById('send_new_message');
const messages_view = document.getElementById('messages');
const contact_view = document.getElementById('contacts');
const receiverID_sendmessage = document.getElementById('receiver_sending');
const newConversation_button = document.getElementById('new_conversation');
const menu_button = document.getElementById('chat_drop_button');
const contactslist = [];
let content;
let contact;

/**
 * Hakee käyttäjän id:n ja asettaa sen ikkunaan näkyville
 *
 */
const getUserid = () => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      const res = JSON.parse(request.responseText);
      console.log(res);
      menu_button.innerHTML = `<span style="text-align: center">${res}</span>`;
    }
  }
  request.open('GET',
      `http://127.0.0.1:8081/api/v1/userid`);
  request.send();
}

/**
 * Hakee XMLHttpRequest:illä datan res -parametriin ja lisää chat sivulle viestit ja aiemmat kontaktit
 * kutsumalla @function contactsToScreen() ja @function messagesToScreen() -funktioita
 */
const getMessages = () => {
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      //console.log(request.responseText);
      const res = JSON.parse(request.responseText);
      content = res;
      console.log(res);
      contactsToScreen(res);
      messagesToScreen(res, undefined);
      request.open('GET',
          `http://127.0.0.1:8081/api/v1/messages/`);
      request.send();
    } else if (request.readyState === 4 && request.status === 204) {
      request.open('GET',
          `http://127.0.0.1:8081/api/v1/messages/`);
      request.send();
    }

  };

  request.open('GET',
      `http://127.0.0.1:8081/api/v1/messages/`);
  request.send();
};

/**
 * Luo ruudulle elementit aiempia kontakteja varten ja lisää kuuntelijan keskustelun aktivointia varten
 * Välittää luotuoihin elementteihin saadut käyttäjien id: tiedot res -parametriltä
 * Kutsuu messagesToScreen funktion, kun klikataan kontaktia ja kontaktin id:llä hakee näytölle asetettavat viestit
 *
 * @param res
 */
const contactsToScreen = (res) => {
  res.map(message => {

    if (Number(message.sender) === 1) {
      console.log(message.userid)
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

/**
 * Luo viestien elementit ja välittää niihin saadut arvot res -parametriltä
 * lastcontact parametri määrittää kenen vastaanottajan viestit haetaan näytölle ja tuo ne ruudulle omilla class nimikkeillään
 *
 * @param res
 * @param lastcontact
 *
 */
const messagesToScreen = (res, lastcontact) => {
  if (lastcontact) {
    contact = lastcontact;
  }
  messages_view.innerHTML = '';
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
  gotoBottom();
  //getMessages();
};
/**
 * Viestin lähetys napin kuuntelija, joka hakee tekstikentän sisällön ja tarkistaa ettei se ole tyhjä
 * luo ja lähettää lomakkeen XMLHttpRequest:illä POST metodia käyttäen
 */
send_new_message.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('lähetetään...');

  const uusiviesti_sisalto = document.getElementById('uusiviesti_sisalto');
  if (uusiviesti_sisalto.value !== '') {

    const formData = new FormData(document.getElementById('new_message_form'));

    uusiviesti_sisalto.value = '';
    const requestPost = new XMLHttpRequest();
    requestPost.open('POST', 'http://127.0.0.1:8081/api/v1/messages');
    requestPost.setRequestHeader('Content-Type', 'application/json');
    requestPost.send(JSON.stringify(Object.fromEntries(formData)));
//  console.log(formData);
    requestPost.onreadystatechange = () => {
      if (requestPost.readyState === 4 && requestPost.status === 201) {

      }
    }
  }
});

/**
 * luo kuuntelijan uuden keskustelun napille, joka tuo esiin prompt -ikkunan joka kysyy vastaanottajan id:n
 * ID:llä luo kontakti elementin yhteystieto palstalle ja hakee automaattisesti viestit näytölle aktiivisesti.
 */
const newContacts = () => {
  newConversation_button.addEventListener('click', ()=> {
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
  });
}

/**
 * Vierittää chat ikkunan alimpaan viesti elementtiin, näyttäen viimeisimmän viestin
 */
function gotoBottom(){
  const element = document.getElementById('messages');
  element.scrollTop = element.scrollHeight - element.clientHeight;
}

/**
 * Kutsuu funktiot chat.js suorittaessa, sivun latautuessa.
 */
getUserid();
newContacts();
getMessages();



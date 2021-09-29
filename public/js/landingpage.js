'use strict';

/**
 * hakee modaalin sign up ja sign in
 * kun käyttäjä klikkaa modaalin ulkopuolelle, suljetaan modaali
 * @type {HTMLElement}
 */

let modal_sign_up = document.getElementById('sign up');
window.onclick = function(event) {
  if (event.target === modal_sign_up) {
    modal_sign_up.style.display = 'none';
  }
};

let modal_sign_in = document.getElementById('sign in');
window.onclick = function(event) {
  if (event.target === modal_sign_in) {
    modal_sign_in.style.display = 'none';
  }
};

/**
 * Tarkistaa onko salasanat samat
 * @type {function}
  */
function onChange() {
  const password = document.querySelector('input[name=password]');
  const confirm = document.querySelector('input[name=password-repeat]');
  if (confirm.value === password.value) {
    confirm.setCustomValidity('');
  } else {
    confirm.setCustomValidity('Salasanat eivät ole samat');
  }
}

/**
 * luo function joka palauttaa määrätyn keksin arvon
 * @param cname
 * jos keksiä ei löydy palauttaa tyhjän stringin
 * @returns {string}
 */
function getCookie(cname) {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

/**
 * Näyttää error viestin sivulle, jos käyttäjä yrittää mennä chat-sivulle ilman että on kirjoitunut sisälle
 */
const messageToScreen = () => {
  if (Number(getCookie('show_messages')) === 1) {
    alert(decodeURI(getCookie('messages')));
    document.cookie = "show_messages=0"
    document.cookie = "messages="
  }
};
messageToScreen();
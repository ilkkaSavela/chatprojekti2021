'use strict';


const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const util = require('util');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const passwordHash = require('password-hash');

let muutuunut = false;

/**
 * Avaa yhteyden tietokantapalvelimeen
 * @type {Connection}
 */
const con = mysql.createConnection({
  host: 'mysql.metropolia.fi',
  user: 'ilkkajs',
  password: 'WebProjekti2020',
  database: 'ilkkajs',
});

passport.serializeUser((user, done) => {
  console.log('serialize:', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
 * Tarkastaa annetun käyttäjätunnuksen ja salasana.
 * Mikäli käyttäjätunnus ja salasana ovat oikein, palauttaa käyttäjän tiedot.
 *
 * @return käyttäjän tiedot
 */
passport.use(new LocalStrategy(
    (username, password, done) => {
      console.log('passport.use');
      let res = null;

      const login = (username, password) => {
        return new Promise(((resolve, reject) => {
          console.log(username);
          console.log(password);
          con.query('SELECT * FROM users WHERE user_name = ?',
              [username, password],
              (err, result) => {
                console.log(result);
                if (result) {
                  resolve(result);
                } else {
                  reject('syy');

                }
              });
        }));
      };
      return login(username, password).then((result) => {
        if (result.length < 1) {
          console.log('Käyttäjätietojen haku ei onnistunu');
          return done(null, false);
        } else {
          console.log('Käyttäjätietojen haku onnistui');

          if (passwordHash.verify(password, result[0].password)) {
            console.log('hash ok');
            result[0].password = '';
            return done(null, result[0]);
          } else {
            console.log('hash fail');

            result[0].password = '';
            return done(null, false);
          }
        }
      }).catch(() => {
        console.log('Kirjautuminen ei onnistunut');
        return done(null, false);
      });
    },
));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser('testi'));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Palauttaa etusivun
 */
app.get('/', function(req, res) {
  console.log('Etusivu kutsuttu');
  res.sendFile(__dirname + '/public/' + 'landingpage.html');
});

/**
 * Palauttaa chat-sivun mikäli käyttäjä on kirjautunut sisään.
 * Muuten uudelleenohjaus etusivulle ja alert näkyviin.
 */
app.get('/chat', function(req, res) {
  console.log('Chat kutsuttu');
  if (req.signedCookies.userID) {
    muutuunut = true;
    res.sendFile(__dirname + '/public/' + 'chatpage.html');

  } else {
    res.cookie('show_messages', 1);
    res.cookie('messages', 'Kirjaudu ensin sisälle.');
    res.redirect('/');
  }
});

/* API */

/* Viestien haku */
/**
 * Palauttaa kaikki viestit joissa sisäänkirjautunut käyttäjä on lähettäjä tai vastaanottaja.
 */
app.get('/api/v1/messages', function(req, res) {
  console.log('API viestit kutsuttu');
  console.log(req.signedCookies.userID);

  const viesti = () => {
    return new Promise((resolve, reject) => {

      if (muutuunut) {
console.log('data muuttunut')
        con.query('SELECT * FROM data WHERE sender=? or receiver=?',
            [req.signedCookies.userID, req.signedCookies.userID],
            function(err, result, fields) {
              if (err) throw err;
              if (result) {
                resolve(result);
              } else {
                reject('dataa ei saada haettua')
              }
            });
      }
      setTimeout(() => {
        reject('timeout');
      }, 15000);
    });
  };
  viesti().then((result) => {
    const messages = [];
    muutuunut = false;
      result.map((message) => {
        const sender = () => {
          if (Number(message.sender) ===
              Number(req.signedCookies.userID)) {
            return 1;
          } else return 2;
        };
        messages.push({
          'userid': req.signedCookies.userID,
          'sender': sender(),
          'message': message,
        });
      });

    res.send(messages);
  }).catch((reason)=> {
    res.sendStatus(204);
  })

});

/* Viestien haku END */
/**
 * Palauttaa sisäänkirjautuneen käyttäjän id:n
 */
app.get('/api/v1/userid', function(req, res) {
  console.log('userID kutsuttu', req.signedCookies.userID);
  res.send(req.signedCookies.userID);
});
/* UUSI VIESTI */
/**
 * Ottaa vastaan uuden viestin JSON muodossa, täydentää siihen lähettäjäksi sisäänkirjautuneen käyttäjän ja lisää viestin tietokantaan.
 */
app.post('/api/v1/messages/', function(req, res) {
  console.log('Uusi viesti lähetetty');
  const query = util.promisify(con.query).bind(con);
  const message = req.body;
  console.log(message);
  console.log(req.signedCookies.userID);
  (async () => {
    try {

      const sqlquery = 'INSERT INTO data (sender, receiver, message, received)'
          + 'VALUES (?, ?, ?, ?)';
      await query(sqlquery,
          [req.signedCookies.userID, message.receiver, message.message, 0]);
      muutuunut = true;
      res.sendStatus(201);

    } catch (err) {
      console.log('Database error!' + err);
    } finally {

    }

  })
  ();
});

/* UUSI VIESTI END */
/* API END */

/**
 * Ottaa vastaan kirjautumistiedot ja välittää ne passport.use sisällä olevalle funktiolle joka palautaa käyttäjän tiedot jos kirjautumistiedot ovat oikein.
 * Jos saadaan vastauksena käyttäjän tiedot, lähetetään selaimeen userID cookie signattuna ja uudelleenohjataan chat-sivulle.
 * Muutoin uudelleen ohjataa etusivulle ja laitetaan näkyviin alert.
 */
/*login*/
app.post('/login/', function(req, res, next) {
  console.log('login aloitettu');
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('käyttäjä ei löytyny');
      res.cookie('show_messages', 1);
      res.cookie('messages', 'Väärä käyttäjätunnus tai salasana');
      return res.redirect('/');
    }
    req.logIn(user, function(err) {
      res.cookie('userID', user.id, {signed: true});

      if (err) {
        return next(err);
      }
      return res.redirect('/chat');
    });
  })(req, res, next);
});
/* Login END */

/* LogOut */
/**
 * Poistaa userID evästeen, uudellenohjaa etusivulle ja laitaa näkyviin alertin.
 */
app.get('/logout', (req, res) => {
  res.clearCookie('userID');
  res.cookie('show_messages', 1);
  res.cookie('messages', 'Ulos kirjautuminen onnistui');
  res.redirect('/');
});

/* Register */
/**
 * Ottaa vastaan käyttäjätiedot ja tarkastaa onko käyttäjänimi jo tietokannassa.
 * Jos käyttäjätunnus on vapaa, hashataan salasana ja lisätään ne tietokantaan.
 *
 *
 */
app.use('/register', function(req, res, next) {
  const data = [req.body.username, req.body.password];
  console.log(data);

  con.query('SELECT * FROM users WHERE user_name = ?', data[0],
      (err, result) => {
    if (result != undefined) {
        if (result.length > 0) {
          res.cookie('show_messages', 1);
          res.cookie('messages', 'Käyttäjänimi on varattu.');
          res.redirect('/');
        }
      }});
  const hashedpass = passwordHash.generate(data[1]);
  con.query('INSERT into users (user_name, password) VALUES (?,?)',
      [data[0], hashedpass],
      (err, result) => {
        console.log(err)
        console.log(result);
      });
  return next();

});
/**
 * Jos uusi käyttäjä saatiin luotua, yritetään sisäänkirjautumista.
 *
 */
app.post('/register', function(req, res, next) {
  console.log('rekisteröinti aloitettu', req.user);
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('käyttäjä ei löytyny');
      res.sendStatus();
      return res.redirect('/fail');
    }
    req.logIn(user, function(err) {
      res.cookie('userID', user.id, {signed: true, secure: 'testi'});

      if (err) {
        return next(err);
      }
      res.cookie('show_messages', 1);
      res.cookie('messages',
          'Käyttäjän luonti onnistui! Voit nyt kirjautua sisälle.');
      return res.redirect('/');
    });
  })(req, res, next);
});

/**
 * Avaa serverin localhostiin portissa 8081
 * Kirjoitetaan consoliin osoite ja portti.
 * @type {http.Server}
 */
const server = app.listen(8081, 'localhost', function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Serveri käynnistetty');
  console.log('Sovellus kuuntelee osoitetta: http://%s:%s', host, port);
});



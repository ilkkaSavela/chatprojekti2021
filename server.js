const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const bodyParser = require('body-parser'); // Create application/x-www-form-urlencoded parser (for POST)
const url = require('url');
const mysql = require('mysql');
const util = require('util'); // for async calls
const secrets = require('./config/secrets.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
let hashedPw;

//DEBUG muuttuja!!!/////////
let muutuunut = false;

let urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // for reading JSON
let accessToken;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


const conn = mysql.createConnection({
  host: 'mysql.metropolia.fi',
  user: 'ilkkajs',
  password: 'WebProjekti2020',
  database: 'ilkkajs',
});
// node native promisify
const query = util.promisify(conn.query).bind(conn); // is bind needed?

conn.connect(function(err) {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers',
      'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.post('/api/register', function(req, res) {
  const jsonObj = req.body;
  console.log('Jsonobjekti: ' + jsonObj);

  let sqlquery = 'INSERT INTO users (email, password) VALUES (?, ?)';
  (async () => {
    try {
      hashedPw = await bcrypt.hash(jsonObj.password, saltRounds);
      await query(sqlquery, [jsonObj.email, hashedPw]);
      res.status(200).send('POST succesful ' + req.body);
    } catch (e) {
      console.log(e);
      res.status(400).send('POST was not succesful ' + e);
    }
  })();
});

app.post('/api/login', function(req, res) {
  console.log('testi');
  const q = req.body;
  const email = q.email;
  const password = q.password;

  const sql = 'SELECT users.id, users.email, users.password'
      + ' FROM users'
      + ' WHERE users.email = ?';

  const query = util.promisify(conn.query).bind(conn);

  (async () => {
    try {
      const rows = await query(sql, [email]);
      console.log('Rows: ' + rows);

      if (rows.length > 0) {
        hashedPw = rows[0].password;
        console.log(hashedPw);
        bcrypt.compare(password, hashedPw, function(err, result) {
          if (result === true) {
            console.log('Salasana oikein');
            accessToken = jwt.sign({id: rows[0].id, email: email}, secrets.jwtSecret,
                {expiresIn: '1h'}); // expires in one hour
            muutuunut = true;
            res.status(202).json({accessToken: accessToken, userID: rows[0].id});
          } else {
            console.log('Salasana v????rin');
            res.sendStatus(401);

          }
        });
      } else {
        //Luodaan uusi k??ytt??j??
        console.log('Luodaan uusi k??ytt??j??');
        const sqlquery = 'INSERT INTO users (email, password) VALUES (?, ?)';
          try {
            hashedPw = await bcrypt.hash(q.password, saltRounds);
            const response = await query(sqlquery, [q.email, hashedPw]);
            const secondQuery = 'SELECT * FROM users WHERE id=?'
            const newU = await query(secondQuery, [response.insertId]);
            accessToken = jwt.sign({id: newU[0].id, email: newU[0].email}, secrets.jwtSecret,
                {expiresIn: '1h'});
            res.status(201).json({accessToken: accessToken, userID: newU[0].id });
          } catch (e) {
            console.log(e);
            res.sendStatus(400);
          }

      }

    } catch (err) {
      console.log('Database error!' + err);
    } finally {
    }
  })();

});
app.post('/api/messages', function(req, res) {
  console.log('Uusi viesti l??hetetty');
  const query = util.promisify(conn.query).bind(conn);
  const message = req.body;
  console.log(message.token);
  const sender_token = jwt.decode(message.token);
  (async () => {
    try {

      const sqlquery = 'INSERT INTO data (sender, receiver, message, received)'
          + 'VALUES (?, ?, ?, ?)';
      await query(sqlquery,
          [sender_token.id, message.receiver, message.message, 0]);
      muutuunut = true;
      res.sendStatus(202);

    } catch (err) {
      console.log('Database error!' + err);
    } finally {

    }

  })
  ();
});


app.get('/api/messages', function(req, res) {
  console.log('API viestit kutsuttu');
  const param = url.parse(req.url, true).query;
  const token = jwt.decode(param.token);
  muutuunut = true;
  const viesti = () => {
    return new Promise((resolve, reject) => {

      if (muutuunut) {
        conn.query('SELECT * FROM data WHERE sender=? or receiver=? ',
            [token.id, token.id],
            function(err, result, fields) {
              if (err) throw err;
              if (result) {
                resolve(result);
              } else {
                reject('dataa ei saada haettua');
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
            Number(token.id)) {
          return 1;
        } else return 2;
      };
      messages.push({
        'userid': token.id,
        'sender': sender(),
        'message': message,
      });
    });

    res.send(messages);
  }).catch((reason) => {
    res.sendStatus(204);
  });

});

const server = app.listen(8080, 'localhost', function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
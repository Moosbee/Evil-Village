"use strict";
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 80;

const http = require('http').Server(app);
const io = require('socket.io')(http);

//Mysql
const mysql = require('mysql2');
// create the connection to database

let configuration = fs.readFileSync('./config.json', 'utf-8');
global.configur = JSON.parse(configuration);

if (configur.MySql.state) {
  global.connection = mysql.createConnection({
    host: configur.MySql.host,
    user: configur.MySql.user,
    password: configur.MySql.password,
    database: configur.MySql.database
  });
}



const hasha = require("./onlyserver/hashing");

const game = require("./game/game");


//Server aktivieren-----------------------------------------------

app.use(bodyParser.urlencoded({ extended: true }));
app.all('*', function (req, res, next) {
  console.log("Anfrage");
  next(); // pass control to the next handler
});


//Handeling anfragen-----------------------------------------------

game.httplistener(app);

app.get('/', (req, res) => {

  // console.log("Request");
  // console.log(req);
  // console.log("Responce");
  // console.log(res);
  // console.log("Ende");

  fs.readFile("./unpublic/home.html", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send('<h1>Error</h1>');
    }
    res.send(data);
  });
});

app.get('/login', (req, res) => {

  fs.readFile("./unpublic/login.html", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send('<h1>Error</h1>');
    }
    res.send(data);
  });
});

//fuer einloggen benutze Node.js Passport
app.post('/login', (req, res) => {

  //res.send("data");
  //console.log(req.body);
  let resiveddata = req.body;
  resiveddata["passwordfld"] = hasha.hash(resiveddata["passwordfld"], resiveddata["usernamefld"]);

  var anfrag = "SELECT id, vorname, nachname, benutzername, passwort FROM `users` WHERE benutzername='" + resiveddata["usernamefld"] + "' AND passwort='" + resiveddata["passwordfld"] + "'";
  connection.query(anfrag, (err, results) => {
    if (err) {
      console.log(err);
      res.send('{"state":"failed"}');
      return;
    } else if (results.length == 0) {
      res.send('{"state":"wrong"}');
    } else {
      let sent = results[0];
      sent["state"] = "success";
      //console.log(sent);
      //console.log(JSON.stringify(sent));
      res.send(JSON.stringify(sent));
    }
  });
});



app.get('/makeuser', (req, res) => {

  fs.readFile("./unpublic/makeUser.html", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send('<h1>Error</h1>');
    }
    res.send(data);
  });
});

app.post('/makeuser', (req, res) => {
  console.log(req.body);
  let resiveddata = req.body;
  resiveddata["passwordfld"] = hasha.hash(resiveddata["passwordfld"], resiveddata["usernamefld"]);


  let anfrag = "SELECT benutzername FROM `users` WHERE benutzername='" + resiveddata["usernamefld"] + "'";
  connection.query(anfrag, (err, results) => {
    if (results.length == 0) {

      anfrag = "INSERT INTO `users` (`id`, `vorname`, `nachname`, `benutzername`, `passwort`) VALUES (NULL, '" + resiveddata["firstnamefld"] + "', '" + resiveddata["lastnamefld"] + "', '" + resiveddata["usernamefld"] + "', '" + resiveddata["passwordfld"] + "')";
      connection.query(anfrag, (err, results) => {
        if (err) {
          console.log(err);
          res.send('{"state":"failed"}');
          return;
        }

        anfrag = "SELECT id, vorname, nachname, benutzername FROM `users` WHERE benutzername='" + resiveddata["usernamefld"] + "'";
        connection.query(anfrag, (err, results) => {
          if (err) {
            console.log(err);
            res.send('{"state":"failed"}');
            return;
          }
          let sent = results[0];
          sent["state"] = "success";
          console.log(sent);
          console.log(JSON.stringify(sent));
          res.send(JSON.stringify(sent));
        });
      });

    } else {
      res.send('{"state":"taken"}');
    }
  });
});


app.get('/logedin', (req, res) => {

  fs.readFile("./unpublic/logedin.html", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send('<h1>Error</h1>');
    }
    res.send(data);
  });
});

app.get('/shutdown', (req, res) => {
  res.send('<h1 color="red">Shutdown</h1>');
  game.end(0);
});


app.get('/favicon.ico', (req, res) => {
  console.log("favicon");
  let faf = configur.favicon;
  let dir = "./unpublic/farvi/" + faf + ".ico";
  fs.readFile(dir, (err, data) => {
    if (err) {
      res.status(500).send('<h1>Error</h1>');
      console.log(err);
      return;
    }
    res.send(data);
  });
});

//Socket.io ----------------------------------------------------

//Whenever someone connects this gets executed
io.on('connection', function (socket) {
  console.log('A user connected');


  socket.on('test', function () {
    console.log('A user tested');
  });

  socket.on('putupdate', function (data) {
    console.log(data);
          let selectobject = object.filter(arm => (arm.id == data.id));

          if (!((data.x == -1) && (data.y == -1))) {
              selectobject[0].goto(data.x, data.y);
          }

          if (data.settele) {
              selectobject[0].settle();
          }
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

setInterval(() => {
  let info=JSON.stringify(object);
  io.emit('update', info);
  //console.log("tetetw");
}, 100);



//Server chatch -------------------------------------------------

app.use('/media', express.static('public'));

app.all('*', function (req, res, next) {
  try {
    console.log(req);
    res.status(400).send("<h1>Error</h1>");
    console.log('An Idiot has a typo!');
  } catch (error) {
    console.log(error);
  }
  next(); // pass control to the next handler
});



http.listen(port, () => {
  console.log(`Schulprojekt listening on port ${port}!`);
  game.start();

});

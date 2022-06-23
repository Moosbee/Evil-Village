import { readFileSync } from 'fs';

import express from 'express';
// const express = require('express');
import { urlencoded } from 'body-parser';
// const bodyParser = require('body-parser');
import cookieParser from 'cookie-parser';
// const cookieParser = require('cookie-parser');
const app = express();

const http = require('http').Server(app);
// const io = require('socket.io')(http);

import { Server } from 'socket.io';

import { config } from './config';

const io = new Server();

interface configInterface {
  MaxPlayers: number;
  PlayerFile: string;
  Game: {
    ResetOnStart: boolean;
    Map: number;
    saveFile: string;
  };
  favicon: number;
}

import { createUser, verify } from './backend/auth';

//Server aktivieren-----------------------------------------------

app.all('*', function (req, res, next) {
  console.log(req.method + ' Anfrage ' + req.url);
  next(); // pass control to the next handler
});

app.use('/media', express.static(config.rootPath + './frontend/public'));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
//app.use(cookieParser('my secret here'));

//Handeling anfragen-----------------------------------------------

app.use('/game',require("./backend/game"))

app.get('/', async (req, res) => {
  res.sendFile(config.rootPath + './frontend/unpublic/home.html');
});

app.get('/login', async (req, res) => {
  res.sendFile(config.rootPath + './frontend/unpublic/login.html');
});

//fuer einloggen benutze Node.js Passport
app.post('/login', async (req, res) => {
  //console.log(req.body);
  let resiveddata = req.body;

  let erg = await verify(
    resiveddata['usernamefld'],
    resiveddata['passwordfld']
  );

  if (typeof erg == 'number') {
    let sent: number = erg;
    res.send(
      JSON.stringify({
        state: 'success',
        id: sent,
      })
    );
  } else if (erg == 'wrong') {
    res.send('{"state":"wrong"}');
  } else if (erg == 'failed') {
    res.send('{"state":"failed"}');
    return;
  } else {
    res.send('{"state":"failed"}');
    return;
  }
});

app.get('/makeuser', async (req, res) => {
  res.sendFile(config.rootPath + './frontend/unpublic/makeuser.html');
});

app.post('/makeuser', async (req, res) => {
  // console.log(req.body);
  let resiveddata = req.body;

  let erg = await createUser(
    resiveddata['usernamefld'],
    resiveddata['passwordfld'],
    1000
  );
  if (typeof erg == 'number') {
    let sent: number = erg;
    res.send(
      JSON.stringify({
        state: 'success',
        id: sent,
      })
    );
  } else if (erg == 'taken') {
    res.send('{"state":"taken"}');
  } else if (erg == 'failed') {
    res.send('{"state":"failed"}');
    return;
  } else {
    res.send('{"state":"failed"}');
    return;
  }
});

app.get('/logedin', async (req, res) => {
  res.sendFile(config.rootPath + './frontend/unpublic/logedin.html');
});

app.get('/shutdown', async (req, res) => {
  res.send('<h1 color="red">Shutdown</h1>');
  //game.end(0);
});

app.get('/favicon.ico', async (req, res) => {
  console.log('favicon');
  let faf = config.favicon;
  let dir = config.rootPath + './frontend/unpublic/farvi/' + faf + '.ico';
  res.sendFile(dir);
});

//Socket.io ----------------------------------------------------

//Whenever someone connects this gets executed
io.on('connection', function (socket) {
  console.log('A user connected');

  socket.on('test', function () {
    console.log('A user tested');
  });

  socket.on('putupdate', function (data) {
    // console.log(data);
    // let selectobject = object.filter((arm) => arm.id == data.id);
    // if (!(data.x == -1 && data.y == -1)) {
    //   selectobject[0].goto(data.x, data.y);
    // }
    // if (data.settele) {
    //   selectobject[0].settle();
    // }
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

// setInterval(() => {
//   let info = JSON.stringify(object);
//   io.emit('update', info);
//   //console.log("tetetw");
// }, 100);

//Server chatch -------------------------------------------------

app.all('*', function (req, res, next) {
  try {
    //console.log(req);
    res.status(400).send('<h1>Error</h1>');
    console.log('An Idiot has a typo!');
  } catch (error) {
    console.log(error);
  }
  next(); // pass control to the next handler
});

http.listen(config.port, () => {
  console.log(`Schulprojekt listening on port ${config.port}!`);
  //game.start();
});

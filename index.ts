import express from 'express';
import { urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { config } from './config';
import { createUser, verify } from './backend/auth';
import { game } from './backend/gamelogic';
import { changes, makeRamdomInt } from './backend/serverutilities';

const app = express();
const io = new Server();
const http = require('http').Server(app);
var localGame = new game();

//Server aktivieren-----------------------------------------------

app.all('*', function (req, res, next) {
  console.log(req.method + ' Anfrage ' + req.url);
  next(); // pass control to the next handler
});

app.use('/media', express.static(config.rootPath + './frontend/public'));
// app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
//app.use(cookieParser('my secret here'));

//Handeling anfragen-----------------------------------------------

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

app.get('/game/main', (req, res) => {
  res.sendFile(config.rootPath + './frontend/unpublic/maingameframe.html');
});

app.get('/game/config', (req, res) => {
  res.sendFile(config.rootPath + './frontend/unpublic/maingameframe.html');
});

app.get('/game/map', (req, res) => {
  let mapDir = config.rootPath + './both/maps/map_';
  let mapNumber: number = config.Game.Map;
  mapDir = mapDir + mapNumber + '.png';
  res.sendFile(mapDir);
});

app.post('/game/main', (req, res) => {
  // let resiveddata = req.body;
  // console.log(resiveddata);
  // if (resiveddata['id'] == undefined) {
  //   res.send('<h1>Error</h1>');
  //   return;
  // } else {
  //   let idd = resiveddata['id'];
  //   let selectobject = globalThis.gameObjects.filter(
  //     (arm) => arm.owner == idd && arm.capital == true
  //   );
  //   if (selectobject.length == 0) {
  //     let min = 75;
  //     let max = 930;
  //     let x = makeRamdomInt(min,max);
  //     let y = makeRamdomInt(min,max);
  //     globalThis.gameObjects.push(new stadt(x, y, resiveddata['id'], true));
  //     globalThis.gameObjects[globalThis.gameObjects.length - 1].arraypos = globalThis.gameObjects.length - 1;
  //   }
  // }
  // res.send(JSON.stringify(globalThis.gameObjects));
});

app.get('/game/update', (req, res) => {
  setTimeout(function () {
    res.send(localGame.getUpdateEasy());
  }, 101);
});

app.post('/game/update', (req, res) => {
  let resiveddata: changes[] = req.body;
  console.log(resiveddata);

  localGame.update(resiveddata);

  setTimeout(function () {
    res.send(localGame.getUpdateEasy());
  }, 101);
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

  socket.on('update', function (data) {
    let resiveddata: changes[] = data;
    console.log(resiveddata);

    localGame.update(resiveddata);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

setInterval(() => {
  io.emit('update', localGame.getUpdateEasy());
}, 100);

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

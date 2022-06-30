import express from 'express';
// import { urlencoded } from 'body-parser';
// import cookieParser from 'cookie-parser';
import { config } from './config';
import { createUser, verify } from './gamelogic/auth';
import { gamelogic } from './gamelogic/gamelogic';
import { changes } from './gamelogic/serverutilities';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { normalize, resolve } from 'path';
import morgan from "morgan";

const app = express();
var localGame = new gamelogic();

//Server aktivieren-----------------------------------------------

// app.all('*', function (req, res, next) {
//   console.log(req.method + ' Anfrage an: ' + req.url);
//   next(); // pass control to the next handler
// });

app.use(morgan("dev"))

app.use('/media', express.static(config.rootPath + '../frontendd/public'));
// app.use(urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser());

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
//app.use(cookieParser('my secret here'));

//Handeling anfragen-----------------------------------------------

app.get('/', async (req, res) => {
  res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/home.html'));
});

app.get('/login', async (req, res) => {
  res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/login.html'));
});

app.get('/makeuser', async (req, res) => {
  res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/makeuser.html'));
});

app.get('/logedin', async (req, res) => {
  res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/logedin.html'));
});

app.get('/game/main', (req, res) => {
  res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/maingameframe.html'));
});

app.get('/game/config', (req, res) => {
  res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/config.html'));
});

app.get('/favicon.ico', async (req, res) => {
  console.log('favicon');
  let faf = config.favicon;
  let dir = resolve(config.rootPath + '../frontendd/unpublic/farvi/' + faf + '.ico');
  res.sendFile(dir);
});

//fuer einloggen benutze Node.js Passport
app.post('/login', async (req, res) => {
  // console.log(req.body);
  let resiveddata = req.body;

  if (
    typeof resiveddata['username'] != 'string' ||
    typeof resiveddata['password'] != 'string'
  ) {
    res.json({ state: 'failed' });
    return;
  }
  let username: string = resiveddata['username'];
  let password: string = resiveddata['password'];

  let erg = await verify(username, password);

  if (erg != 'wrong' && erg != 'failed') {
    res.json({
      state: 'success',
      id: erg.id,
      username: erg.username,
      pass: erg.pass,
    });
  } else if (erg == 'wrong') {
    res.json({ state: 'wrong' });
    return;
  } else if (erg == 'failed') {
    res.json({ state: 'failed' });
    return;
  } else {
    res.json({ state: 'failed' });
    return;
  }
});

app.post('/makeuser', async (req, res) => {
  // console.log(req.body);

  // res.json({ state: 'failed' });

  let resiveddata = req.body;
  if (
    typeof resiveddata['username'] != 'string' ||
    typeof resiveddata['password'] != 'string'
  ) {
    res.json({ state: 'failed' });
    return;
  }
  let username: string = resiveddata['username'];
  let password: string = resiveddata['password'];

  let erg = await createUser(username, password);
  if (erg != 'taken' && erg != 'failed') {
    res.json({
      state: 'success',
      id: erg.id,
      username: erg.username,
      pass: erg.pass,
    });
  } else if (erg == 'taken') {
    res.json({ state: 'taken' });
  } else if (erg == 'failed') {
    res.json({ state: 'failed' });
    return;
  } else {
    res.json({ state: 'failed' });
    return;
  }
});

app.get('/game/map', (req, res) => {
  let mapDir = config.rootPath + './maps/map_';
  let mapNumber: number = config.Game.Map;
  mapDir = mapDir + mapNumber + '.png';
  res.sendFile(normalize(mapDir));
});

app.post('/game/main', (req, res) => {
  let id: string | number | null | undefined = req.body.id;
  if (typeof id == 'number' && !localGame.doesCapitolExist(id)) {
    localGame.addCapitol(id);
  }
  res.send(localGame.getUpdate());
});
app.get('/game/update', (req, res) => {
  res.send(localGame.getUpdate());
});

app.post('/game/update', (req, res) => {
  let resiveddata: changes = req.body;
  console.log(resiveddata);

  localGame.update(resiveddata);

  res.send(localGame.getUpdate());
});

app.get('/shutdown', async (req, res) => {
  res.send('<h1 color="red">Shutdown</h1>');
  localGame.end(0);
});

app.all('*', function (req, res, next) {
  try {
    //console.log(req);
    res.status(400).send('<h1>Error</h1>');
    console.log('An Idiot has a typo!');
    console.log(req.method + ' Anfrage ' + req.url);
  } catch (error) {
    console.log(error);
  }
  next(); // pass control to the next handler
});

//Socket.io ----------------------------------------------------

const httpServer = createServer(app);
const socketServer = new Server(httpServer);

//Whenever someone connects this gets executed
socketServer.on('connection', function (socket) {
  console.log('A user connected: ' + socket.id);

  socket.on('test', function () {
    console.log('A user tested');
  });

  socket.on('update', function (data) {
    console.log(data);
    let resiveddata: changes = data;
    console.log(resiveddata);

    localGame.update(resiveddata);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

setInterval(() => {
  socketServer.emit('update', localGame.getUpdate());
}, 100);

// server.listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

httpServer.listen(config.expressPort, () => {
  console.log(`Schulprojekt listening on port ${config.expressPort}!`);
});

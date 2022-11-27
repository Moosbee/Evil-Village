import express from 'express';
// import { urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config';
import {
  createUser,
  player,
  verify,
  verifyToken,
} from './gamelogic/serverauth';
import { gamelogic } from './gamelogic/gamelogic';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { extname, normalize, parse } from 'path';
import chalk from 'chalk';
import { changes, mapFile, mapMini } from './gamelogic/serverinterfaces';
import { readdir, readFile } from 'fs/promises';

// import  cors from "cors";
const cors = require('cors');

const app = express();
var localGame = new gamelogic();

//Server aktivieren-----------------------------------------------

app.use(cors());

app.all('*', function (req, res, next) {
  console.log(chalk.dim(`${chalk.bold(req.method)} Anfrage an: ${req.url}`));
  next(); // pass control to the next handler
});

app.use('/media', express.static(config.ROOTPATH + '../frontendd/public'));
// app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
//app.use(cookieParser('my secret here'));

// ============================================================================================== //
// ===================================== Handeling anfragen ===================================== //
// ============================================================================================== //

// app.get('/', async (req, res) => {
//   res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/home.html'));
// });

// app.get('/login', async (req, res) => {
//   res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/login.html'));
// });

// app.get('/makeuser', async (req, res) => {
//   res.sendFile(
//     resolve(config.rootPath + '../frontendd/unpublic/makeuser.html')
//   );
// });

// app.get('/logedin', async (req, res) => {
//   res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/logedin.html'));
// });

// app.get('/game/main', (req, res) => {
//   res.sendFile(
//     resolve(config.rootPath + '../frontendd/unpublic/maingameframe.html')
//   );
// });

// app.get('/game/config', (req, res) => {
//   res.sendFile(resolve(config.rootPath + '../frontendd/unpublic/config.html'));
// });

// app.get('/favicon.ico', async (req, res) => {
//   let faf = config.FAVICON;
//   let dir = resolve(
//     config.ROOTPATH + '../frontend/src/assets/farvi/' + faf + '.ico'
//   );
//   res.sendFile(dir);
// });

//fuer einloggen benutze Node.js Passport

// ============================================================================================== //
// ============================================= API ============================================ //
// ============================================================================================== //

app.post('/login', async (req, res) => {
  // console.log(req.body);
  let resiveddata = req.body;

  let erg: player | 'failed' | 'wrong';

  if (
    typeof resiveddata['username'] == 'string' &&
    typeof resiveddata['password'] == 'string'
  ) {
    let username: string = resiveddata['username'];
    let password: string = resiveddata['password'];
    erg = await verify(username, password);
  } else if (typeof req.query.token == 'string') {
    erg = await verifyToken(req.query.token);
  } else {
    res.json({ state: 'failed' });
    return;
  }

  if (erg != 'wrong' && erg != 'failed') {
    res.json({
      state: 'success',
      username: erg.username,
      pass: erg.pass,
      token: erg.token,
      adminLevel: erg.adminLevel,
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
      username: erg.username,
      pass: erg.pass,
      token: erg.token,
      adminLevel: erg.adminLevel,
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

app.get('/config', async (req, res) => {
  res.json(config.getAll());
});
app.post('/config', async (req, res) => {
  if (typeof req.query.token != 'string') {
    res.status(400).json(config.getAll());
    return;
  }

  let Token = req.query.token;
  let erg = await verifyToken(Token);
  if (erg == 'failed' || erg.adminLevel < 3) {
    res.status(403).json(config.getAll());
    return;
  }

  let resiveddata = req.body;
  if (await config.setAllUnk(resiveddata)) {
    res.status(200).json(config.getAll());
  } else {
    res.status(500).json(config.getAll());
  }
});

app.post('/config/single', async (req, res) => {
  let resiveddata = req.body;

  let info = await config.setUnknownConfig(resiveddata);
  if (info) {
    res.status(200).json(config.getAll());
  } else {
    res.status(400).json(config.getAll());
  }
});

app.get('/game/map', (req, res) => {
  const mapDir = config.ROOTPATH + './maps/';
  if (localGame.map == undefined) {
    res.status(500).send('');
    return;
  }
  const mapSrc = normalize(mapDir + localGame.map.mapSRC);
  res.sendFile(mapSrc);
});

app.get('/game/map/:id', async (req, res) => {
  const id = req.params.id;
  const mapDir = config.ROOTPATH + './maps/';
  const mapConfFile = mapDir + id + '.json';

  const mapConf: mapFile = JSON.parse(
    await readFile(normalize(mapConfFile), { encoding: 'utf-8' })
  );

  const mapPath =
    mapConf.smallMapSRC == undefined ? mapConf.mapSRC : mapConf.smallMapSRC;

  const mapSrc = normalize(mapDir + mapPath);
  res.sendFile(mapSrc);
});

app.get('/game/maps', async (req, res) => {
  const mapDir = config.ROOTPATH + './maps/';
  const dir = await readdir(mapDir);
  const files = dir.filter((value) => {
    return extname(value) == '.json';
  });
  let maps: {
    name: string;
    description: string;
  }[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const map: mapFile = JSON.parse(
      await readFile(normalize(mapDir + file), { encoding: 'utf-8' })
    );
    maps.push({
      name: parse(file).name,
      description: map.description,
    });
  }
  res.send(maps);
});

app.post('/game/main', async (req, res) => {
  if (typeof req.query.token != 'string') {
    res.send(localGame.getUpdate());
    return;
  }

  let Token = req.query.token;
  let erg = await verifyToken(Token);
  if (erg == 'failed') {
    res.send(localGame.getUpdate());
    return;
  }

  let owner = erg.username;
  if (typeof owner == 'string' && !localGame.doesCapitolExist(owner)) {
    localGame.addCapitol(owner);
    console.log(chalk.yellow('New Player added!!'));
  }
  res.send(localGame.getUpdate());
});

app.get('/game/update', (req, res) => {
  res.send(localGame.getUpdate());
});

app.post('/game/update', async (req, res) => {
  if (typeof req.query.token != 'string') {
    res.send(localGame.getUpdate());
    return;
  }

  let Token = req.query.token;
  let erg = await verifyToken(Token);
  if (erg == 'failed') {
    res.send(localGame.getUpdate());
    return;
  }
  let resiveddata: changes = req.body.changes;

  // console.log(resiveddata);

  localGame.update(resiveddata, erg.username);

  res.send(localGame.getUpdate());
});

app.get('/shutdown', async (req, res) => {
  res.send('<h1 color="red">Shutdown</h1>');
  localGame.end(0);
});

// app.use('/', express.static('./angularBuild/'));
app.use('/', express.static(normalize(config.ROOTPATH + config.FRONTENDPATH)));

app.all('*', function (req, res, next) {
  try {
    //console.log(req);
    res
      .status(404)
      .sendFile(
        normalize(config.ROOTPATH + config.FRONTENDPATH + './index.html')
      );
    console.log(chalk.redBright('An Idiot has a typo!'));
  } catch (error) {
    console.log(error);
  }
  // next(); // pass control to the next handler
});

//Socket.io ----------------------------------------------------

const httpServer = createServer(app);
const socketServer = new Server(httpServer, {
  cors: {
    origin: config.FRONTENDURL,
    methods: ['GET', 'POST'],
  },
});

//Whenever someone connects this gets executed
socketServer.on('connection', function (socket) {
  console.log(chalk.gray('A user connected: ' + socket.id));

  socket.on('update', function (data) {
    console.log(data);
    let resiveddata: changes = data;
    console.log(resiveddata);

    localGame.update(resiveddata);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log(chalk.red('A user disconnected'));
  });
});

setInterval(() => {
  socketServer.emit('update', localGame.getUpdate());
}, 100);

process.on('beforeExit', async (code) => {
  await localGame.end(code);
});
process.on('SIGINT', async (code) => {
  await localGame.end(1);
});

httpServer.listen(config.EXPRESSPORT, () => {
  console.log(
    chalk.yellow.bold(`Schulprojekt listening on port ${config.EXPRESSPORT}!`)
  );
});

export { socketServer };

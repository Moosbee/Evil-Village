import { Router } from 'express';
import { config } from '../config';
import { armee } from './serverarmee';
import { schiff } from './serverschiff';
import { stadt } from './serverstadt';
import { makeRamdomInt } from './serverutilities';

const router = Router();

declare global {
  // var gameObjects: armee[];
  var gameObjects: (armee | stadt | schiff)[];
}

router.get('/main', (req, res) => {
  res.sendFile(config.rootPath + './frontend/unpublic/maingameframe.html');
});

router.get('/config', (req, res) => {
  res.sendFile(config.rootPath + './frontend/unpublic/maingameframe.html');
});

router.get('/map', (req, res) => {
  let mapDir = config.rootPath + './both/maps/map_';
  let mapNumber:number = config.Game.Map;
  mapDir = mapDir + mapNumber + '.png';
  res.sendFile(mapDir);
});

router.post('/main', (req, res) => {
  let resiveddata = req.body;

  console.log(resiveddata);
  if (resiveddata['id'] == undefined) {
    res.send('<h1>Error</h1>');
    return;
  } else {
    let idd = resiveddata['id'];
    let selectobject = globalThis.gameObjects.filter(
      (arm) => arm.owner == idd && arm.capital == true
    );
    if (selectobject.length == 0) {
      let min = 75;
      let max = 930;
      let x = makeRamdomInt(min,max);
      let y = makeRamdomInt(min,max);

      globalThis.gameObjects.push(new stadt(x, y, resiveddata['id'], true));
      globalThis.gameObjects[globalThis.gameObjects.length - 1].arraypos = globalThis.gameObjects.length - 1;
    }
  }

  res.send(JSON.stringify(globalThis.gameObjects));
});

router.get('/update', (req, res) => {
  let resiveddata = req.body;
  let selectobject = object.filter(
    (arm) => arm.owner == resiveddata['id'] && arm.capital == true
  );

  if (selectobject.length > 0) {
    selectobject[0].search = selectobject[0].search - 50;
    if (selectobject[0].search < 0) {
      res.send('END');
      selectobject[0].strength = -1;
      return;
    }
  } else {
    res.send('END');
    return;
  }

  console.log(resiveddata);
  if (resiveddata['info'] != '[]') {
    let info = resiveddata['info'];
    let changes = JSON.parse(info);
    update(changes)
  }
  setTimeout(function () {
    res.send(JSON.stringify(object));
  }, 101);
});

router.get('/update', (req, res) => {
  let resiveddata = req.body;
  let selectobject = object.filter(
    (arm) => arm.owner == resiveddata['id'] && arm.capital == true
  );

  if (selectobject.length > 0) {
    selectobject[0].search = selectobject[0].search - 50;
    if (selectobject[0].search < 0) {
      res.send('END');
      selectobject[0].strength = -1;
      return;
    }
  } else {
    res.send('END');
    return;
  }

  console.log(resiveddata);
  if (resiveddata['info'] != '[]') {
    let info = resiveddata['info'];
    let changes = JSON.parse(info);
    update(changes)
  }
  setTimeout(function () {
    res.send(JSON.stringify(object));
  }, 101);
});



export {router}

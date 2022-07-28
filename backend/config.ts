import path from 'path';

let config = {
  rootPath: path.normalize(__dirname + '/'),
  MaxPlayers: 1000,
  PlayerFile: path.normalize('./players.json'),
  plainTextPassword:true,
  Game: {
    ResetOnStart: true,
    Map: 1,
    saveFile: path.normalize('./save.json'),
    runspeed:2,
    maxGameObjects:25000
  },
  favicon: 4,
  expressPort:3000,
};

export { config };

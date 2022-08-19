import path from 'path';

let config = {
  rootPath: path.normalize(__dirname + '/'),
  MaxPlayers: 1000,
  PlayerFile: path.normalize('./players.json'),
  plainTextPassword: true,
  favicon: 4,
  expressPort: 3000,
  frontendURL: 'http://localhost:4200',
  Game: {
    ResetOnStart: true,
    MapFileName: "Aihoia.png",
    saveFile: path.normalize('./save.json'),
    runspeed: 2,
    maxGameObjects: 25000,
  },
};

export { config };

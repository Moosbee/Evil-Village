import path from 'path';

let config = {
  rootPath: path.normalize(__dirname + '/'),
  MaxPlayers: 1000,
  PlayerFile: './players.json',
  Game: {
    ResetOnStart: true,
    Map: 1,
    saveFile: './save.json',
  },
  favicon: 4,
  port:80
};

export { config };

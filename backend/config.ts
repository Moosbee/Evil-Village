import path from 'path';

class config {
  rootPath = '/./';
  MaxPlayers = 1000;
  PlayerFile = './players.json';
  plainTextPassword = true;
  favicon = 4;
  expressPort = 3000;
  frontendURL = 'http://localhost:4200';
  Game = {
    ResetOnStart: true,
    MapFileName: 'Aihoia.png',
    saveFile: './save.json',
    runspeed: 4,
    maxGameObjects: 25000,
  };
  constructor() {
    this.rootPath = path.normalize(__dirname + this.rootPath);
    this.PlayerFile = path.normalize(this.PlayerFile);
    this.Game.saveFile = path.normalize(this.Game.saveFile);
  }
}

export = new config();

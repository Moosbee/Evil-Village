import chalk from 'chalk';
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';

interface gameConfig {
  RESETONSTART: boolean;
  MAPFILENAME: string;
  SAVEFILE: string;
  RUNSPEED: number;
  MAXGAMEOBJECTS: number;
}

interface interfaceConfig {
  ROOTPATH: string;
  MAXPLAYERS: number;
  PLAYERFILE: string;
  PLAINTEXTPASSWORD: boolean;
  EXPRESSPORT: number;
  FRONTENDURL: string;
  FRONTENDPATH: string;
  GAME: gameConfig;
}

class config {
  ROOTPATH = '././';

  MAXPLAYERS: number;
  PLAYERFILE: string;
  PLAINTEXTPASSWORD: boolean;
  EXPRESSPORT: number;
  FRONTENDURL: string;
  FRONTENDPATH: string;

  GAME: gameConfig;
  constructor() {
    this.ROOTPATH = path.normalize(path.resolve(this.ROOTPATH) + '/');
    let configFilePath = path.normalize(
      this.ROOTPATH + './json/configFile.json'
    );
    let jsonConfig = JSON.parse(readFileSync(configFilePath, 'utf8'));

    if (
      typeof jsonConfig.MAXPLAYERS != 'number' ||
      typeof jsonConfig.PLAYERFILE != 'string' ||
      typeof jsonConfig.PLAINTEXTPASSWORD != 'boolean' ||
      typeof jsonConfig.EXPRESSPORT != 'number' ||
      typeof jsonConfig.FRONTENDURL != 'string' ||
      typeof jsonConfig.FRONTENDPATH != 'string' ||
      typeof jsonConfig.GAME.MAPFILENAME != 'string' ||
      typeof jsonConfig.GAME.MAXGAMEOBJECTS != 'number' ||
      typeof jsonConfig.GAME.RESETONSTART != 'boolean' ||
      typeof jsonConfig.GAME.RUNSPEED != 'number' ||
      typeof jsonConfig.GAME.SAVEFILE != 'string'
    ) {
      throw Error('Config File not Right');
    }
    this.MAXPLAYERS = jsonConfig.MAXPLAYERS;
    this.PLAYERFILE = path.normalize(jsonConfig.PLAYERFILE);
    this.PLAINTEXTPASSWORD = jsonConfig.PLAINTEXTPASSWORD;
    this.EXPRESSPORT = jsonConfig.EXPRESSPORT;
    this.FRONTENDURL = jsonConfig.FRONTENDURL;
    this.FRONTENDPATH = path.normalize(jsonConfig.FRONTENDPATH);
    this.GAME = {
      MAPFILENAME: path.normalize(jsonConfig.GAME.MAPFILENAME),
      MAXGAMEOBJECTS: jsonConfig.GAME.MAXGAMEOBJECTS,
      RESETONSTART: jsonConfig.GAME.RESETONSTART,
      RUNSPEED: jsonConfig.GAME.RUNSPEED,
      SAVEFILE: path.normalize(jsonConfig.GAME.SAVEFILE),
    };
  }

  async setAllUnk(newConfig: any): Promise<boolean> {
    if (typeof newConfig != 'object') return false;

    if (
      typeof newConfig.MAXPLAYERS != 'number' ||
      typeof newConfig.PLAYERFILE != 'string' ||
      typeof newConfig.PLAINTEXTPASSWORD != 'boolean' ||
      typeof newConfig.EXPRESSPORT != 'number' ||
      typeof newConfig.FRONTENDURL != 'string' ||
      typeof newConfig.FRONTENDPATH != 'string' ||
      typeof newConfig.GAME.MAPFILENAME != 'string' ||
      typeof newConfig.GAME.MAXGAMEOBJECTS != 'number' ||
      typeof newConfig.GAME.RESETONSTART != 'boolean' ||
      typeof newConfig.GAME.RUNSPEED != 'number' ||
      typeof newConfig.GAME.SAVEFILE != 'string'
    ) {
      return false;
    }
    this.MAXPLAYERS = newConfig.MAXPLAYERS;
    this.PLAYERFILE = path.normalize(newConfig.PLAYERFILE);
    this.PLAINTEXTPASSWORD = newConfig.PLAINTEXTPASSWORD;
    this.EXPRESSPORT = newConfig.EXPRESSPORT;
    this.FRONTENDURL = newConfig.FRONTENDURL;
    this.FRONTENDPATH = newConfig.FRONTENDPATH;
    this.GAME = {
      MAPFILENAME: path.normalize(newConfig.GAME.MAPFILENAME),
      MAXGAMEOBJECTS: newConfig.GAME.MAXGAMEOBJECTS,
      RESETONSTART: newConfig.GAME.RESETONSTART,
      RUNSPEED: newConfig.GAME.RUNSPEED,
      SAVEFILE: path.normalize(newConfig.GAME.SAVEFILE),
    };
    let worked = await this.saveToFile();
    return worked;
  }

  async setAll(newConfig: interfaceConfig) {
    this.MAXPLAYERS = newConfig.MAXPLAYERS;
    this.PLAYERFILE = newConfig.PLAYERFILE;
    this.PLAINTEXTPASSWORD = newConfig.PLAINTEXTPASSWORD;
    this.EXPRESSPORT = newConfig.EXPRESSPORT;
    this.FRONTENDURL = newConfig.FRONTENDURL;
    this.ROOTPATH = newConfig.ROOTPATH;
    this.FRONTENDPATH = newConfig.FRONTENDPATH;
    this.GAME.MAPFILENAME = newConfig.GAME.MAPFILENAME;
    this.GAME.MAXGAMEOBJECTS = newConfig.GAME.MAXGAMEOBJECTS;
    this.GAME.RESETONSTART = newConfig.GAME.RESETONSTART;
    this.GAME.RUNSPEED = newConfig.GAME.RUNSPEED;
    this.GAME.SAVEFILE = newConfig.GAME.SAVEFILE;
    let worked = await this.saveToFile();
    return worked;
  }

  async saveToFile() {
    try {
      let toSave: interfaceConfig = {
        ROOTPATH: this.ROOTPATH,
        MAXPLAYERS: this.MAXPLAYERS,
        PLAYERFILE: this.PLAYERFILE,
        PLAINTEXTPASSWORD: this.PLAINTEXTPASSWORD,
        EXPRESSPORT: this.EXPRESSPORT,
        FRONTENDURL: this.FRONTENDURL,
        FRONTENDPATH: this.FRONTENDPATH,
        GAME: {
          RESETONSTART: this.GAME.RESETONSTART,
          MAPFILENAME: this.GAME.MAPFILENAME,
          SAVEFILE: this.GAME.SAVEFILE,
          RUNSPEED: this.GAME.RUNSPEED,
          MAXGAMEOBJECTS: this.GAME.MAXGAMEOBJECTS,
        },
      };
      let configFilePath = path.normalize(
        this.ROOTPATH + './json/configFile.json'
      );
      await writeFile(configFilePath, JSON.stringify(toSave, null, 2));
      console.log(chalk.dim.greenBright("Saving Config"))
      return true;
    } catch {
      return false;
    }
  }

  getAll(): interfaceConfig {
    let toSave: interfaceConfig = {
      ROOTPATH: this.ROOTPATH,
      MAXPLAYERS: this.MAXPLAYERS,
      PLAYERFILE: this.PLAYERFILE,
      PLAINTEXTPASSWORD: this.PLAINTEXTPASSWORD,
      EXPRESSPORT: this.EXPRESSPORT,
      FRONTENDURL: this.FRONTENDURL,
      FRONTENDPATH: this.FRONTENDPATH,
      GAME: {
        RESETONSTART: this.GAME.RESETONSTART,
        MAPFILENAME: this.GAME.MAPFILENAME,
        SAVEFILE: this.GAME.SAVEFILE,
        RUNSPEED: this.GAME.RUNSPEED,
        MAXGAMEOBJECTS: this.GAME.MAXGAMEOBJECTS,
      },
    };
    return toSave;
  }

  async setConfig(
    newConfig:
      | { type: 'MAXPLAYERS'; value: number }
      | { type: 'PLAYERFILE'; value: string }
      | { type: 'PLAINTEXTPASSWORD'; value: boolean }
      | { type: 'EXPRESSPORT'; value: number }
      | { type: 'FRONTENDURL'; value: string }
      | { type: 'FRONTENDPATH'; value: string }
      | { type: 'GAME-RESETONSTART'; value: boolean }
      | { type: 'GAME-MAPFILENAME'; value: string }
      | { type: 'GAME-SAVEFILE'; value: string }
      | { type: 'GAME-RUNSPEED'; value: number }
      | { type: 'GAME-MAXGAMEOBJECTS'; value: number }
  ) {
    switch (newConfig.type) {
      case 'MAXPLAYERS':
        this.MAXPLAYERS = newConfig.value;
        break;

      case 'PLAYERFILE':
        this.PLAYERFILE = newConfig.value;
        break;

      case 'PLAINTEXTPASSWORD':
        this.PLAINTEXTPASSWORD = newConfig.value;
        break;

      case 'EXPRESSPORT':
        this.EXPRESSPORT = newConfig.value;
        break;

      case 'FRONTENDURL':
        this.FRONTENDURL = newConfig.value;
        break;
      case 'FRONTENDPATH':
        this.FRONTENDURL = newConfig.value;
        break;

      case 'GAME-MAPFILENAME':
        this.GAME.MAPFILENAME = newConfig.value;
        break;

      case 'GAME-MAXGAMEOBJECTS':
        this.GAME.MAXGAMEOBJECTS = newConfig.value;
        break;

      case 'GAME-RESETONSTART':
        this.GAME.RESETONSTART = newConfig.value;
        break;

      case 'GAME-RUNSPEED':
        this.GAME.RUNSPEED = newConfig.value;
        break;

      case 'GAME-SAVEFILE':
        this.GAME.SAVEFILE = newConfig.value;
        break;

      default:
        return false;
        break;
    }
    let worked = await this.saveToFile();
    return worked;
  }
}

export = new config();

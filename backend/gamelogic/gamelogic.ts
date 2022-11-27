import { readFile, writeFile } from 'fs/promises';
import config from '../config';
import { makeRandomInt, genColor } from './serverutilities';
import { armee } from './serverarmee';
import { schiff } from './serverschiff';
import { stadt } from './serverstadt';
import chalk from 'chalk';
import { changes, mapMini, saveFile } from './serverinterfaces';
import { setMap } from './gamemap';
import { normalize } from 'path';
import { socketServer } from '..';

export class gamelogic {
  gameObjects: (armee | stadt | schiff)[];
  map?: mapMini;

  constructor() {
    this.gameObjects = [];

    this.importGameObjects().then(() => {
      setMap().then((map) => {
        this.map = map;
        setInterval(this.gameloop, 100, this);
        setInterval(this.save, 5000, this);
        // setTimeout(this.gameloop, 1000,this);
        console.log(chalk.green.bold('Game Startet'));
      });
    });
  }

  async importGameObjects() {
    let savedGameFile: string;
    try {
      savedGameFile = await readFile(
        normalize(config.ROOTPATH + config.GAME.SAVEFILE),
        {
          encoding: 'utf8',
        }
      );
    } catch (e) {
      savedGameFile = '[]';
      // throw e;
    }

    if (savedGameFile == '' || config.GAME.RESETONSTART) {
      savedGameFile = '[]';
    }

    let savedGame: saveFile[] = JSON.parse(savedGameFile);

    for (let i = 0; i < savedGame.length; i++) {
      const element = savedGame[i];
      let savedObject: armee | schiff | stadt;
      switch (element.typeof.type) {
        case 'saveArmy':
          savedObject = new armee(
            element.x,
            element.y,
            element.owner,
            element.color,
            element.strength,
            element.name,
            element.size,
            element.typeof.gotox,
            element.typeof.gotoy
          );
          break;
        case 'saveSchiff':
          savedObject = new schiff(
            element.x,
            element.y,
            element.owner,
            element.color,
            element.strength,
            element.name,
            element.size,
            element.typeof.gotox,
            element.typeof.gotoy
          );
          break;
        case 'saveStadt':
          savedObject = new stadt(
            element.x,
            element.y,
            element.owner,
            element.color,
            element.strength,
            element.name,
            element.typeof.population,
            element.size,
            element.typeof.capital,
            element.typeof.speed,
            element.typeof.makingofarmy,
            element.typeof.production
          );
          break;
        default:
          continue;
          break;
      }
      this.gameObjects.push(savedObject);
    }
  }

  doesCapitolExist(owner: string) {
    let filterd = this.gameObjects.some((e): boolean => {
      return e instanceof stadt && e.owner == owner && e.capital;
    });
    if (filterd) {
      return true;
    } else {
      return false;
    }
  }

  doesExistAtAll(owner: string) {
    let filterd = this.gameObjects.some((e): boolean => {
      return e.owner == owner;
    });
    if (filterd) {
      return true;
    } else {
      return false;
    }
  }

  addCapitol(owner: string) {
    if (this.map == undefined) return;
    let capital = new stadt(
      makeRandomInt(50, this.map.width - 50),
      makeRandomInt(50, this.map.height - 50),
      owner,
      genColor(),
      undefined,
      'HomeTown' + owner,
      -1,
      undefined,
      true
    );
    capital.arraypos = this.gameObjects.length;
    this.gameObjects.push(capital);
  }

  addStadt() {}
  addArmy() {}
  addSchiff() {}

  getUpdate(): string {
    let savedObjects: saveFile[] = [];

    for (let i = 0; i < this.gameObjects.length; i++) {
      const element = this.gameObjects[i];
      let savedObject: saveFile;
      if (element instanceof armee) {
        savedObject = {
          name: element.name,
          owner: element.owner,
          size: element.size,
          strength: element.strength,
          x: element.x,
          y: element.y,
          color: element.color,
          typeof: {
            type: 'saveArmy',
            gotox: element.gotox,
            gotoy: element.gotoy,
          },
        };
      } else if (element instanceof schiff) {
        savedObject = {
          name: element.name,
          owner: element.owner,
          size: element.size,
          strength: element.strength,
          x: element.x,
          y: element.y,
          color: element.color,
          typeof: {
            type: 'saveSchiff',
            gotox: element.gotox,
            gotoy: element.gotoy,
          },
        };
      } else if (element instanceof stadt) {
        savedObject = {
          name: element.name,
          owner: element.owner,
          size: element.size,
          strength: element.strength,
          x: element.x,
          y: element.y,
          color: element.color,
          typeof: {
            type: 'saveStadt',
            capital: element.capital,
            makingofarmy: element.makingofarmy,
            population: element.population,
            speed: element.speed,
            production: element.production,
          },
        };
      } else {
        continue;
      }

      savedObjects.push(savedObject);
    }
    return JSON.stringify(savedObjects);
  }

  getUpdateEasy(): string {
    return JSON.stringify(this.gameObjects);
  }

  update(change: changes, username?: string) {
    console.log(this.map);

    let gameObject = this.gameObjects.filter((arm) => arm.name == change.name);
    if (gameObject.length != 1) return;
    if (gameObject[0].owner != username) return;

    if (
      change.gotox != undefined &&
      change.gotoy != undefined &&
      (gameObject[0] instanceof armee || gameObject[0] instanceof schiff)
    ) {
      gameObject[0].goto(Math.floor(change.gotox), Math.floor(change.gotoy));
    }
    if (change.settle == true) {
      gameObject[0].settleMerge(this);
    }
    if (typeof change.newName == 'string') {
      gameObject[0].name = change.newName;
    }
    if (change.toggleArmy === true && gameObject[0] instanceof stadt) {
      gameObject[0].production = !gameObject[0].production;
      gameObject[0].makingofarmy =
        gameObject[0].makingofarmy + makeRandomInt(100, 300);
    }
  }

  async end(a: number) {
    await this.save(this);
    console.log(chalk.red('Exiting'));
    process.exit(a);
  }

  async save(game: gamelogic) {
    const data = game.getUpdate();
    await writeFile(normalize(config.ROOTPATH + config.GAME.SAVEFILE), data);
    // console.log('Autosave!');
  }

  async gameloop(game: gamelogic) {
    // console.log("Looped");

    // console.log(game);

    if (config.resetGame == 1) {
      console.log(chalk.dim.red('reloading map'));
      game.map = await setMap();
      socketServer.emit('restart');
    }
    if (config.resetGame == 2) {
      console.log(chalk.red('resetting map'));
      game.map = await setMap();
      game.gameObjects = [];
      socketServer.emit('restart');
    }
    config.resetGame = 0;

    for (let i = 0; i < game.gameObjects.length; i++) {
      let Object = game.gameObjects[i];
      Object.setarraypos(i);
      Object.tick(game);
      //Object.drew();
    }
    game.gameObjects = game.gameObjects.filter((e) => {
      return e.strength > 0;
    });
  }
}

import { readFile, writeFile } from 'fs/promises';
import { config } from '../config';
import {
  changes,
  mapMini,
  saveFile,
  setmap,
  makeRandomInt,
} from './serverutilities';
import { armee } from './serverarmee';
import { schiff } from './serverschiff';
import { stadt } from './serverstadt';
import chalk from 'chalk';

export class gamelogic {
  gameObjects: (armee | stadt | schiff)[];
  map?: mapMini;

  constructor() {
    this.gameObjects = [];

    this.importGameObjects().then(() => {
      setmap().then((mapi) => {
        this.map = mapi;
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
      savedGameFile = await readFile(config.rootPath + config.Game.saveFile, {
        encoding: 'utf8',
      });
    } catch (e) {
      savedGameFile = '[]';
      throw e;
    }

    if (savedGameFile == '' || config.Game.ResetOnStart) {
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
            element.strength,
            element.name,
            element.typeof.population,
            element.size,
            element.typeof.capital,
            element.typeof.speed,
            element.typeof.makingofarmy
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
      makeRandomInt(50, this.map.width),
      makeRandomInt(50, this.map.height),
      owner,
      undefined,
      '',
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
          typeof: {
            type: 'saveStadt',
            capital: element.capital,
            makingofarmy: element.makingofarmy,
            population: element.population,
            speed: element.speed,
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
    let gameObject = this.gameObjects.filter((arm) => arm.name == change.name);

    if (
      change.gotox != undefined &&
      change.gotoy != undefined &&
      (gameObject[0] instanceof armee || gameObject[0] instanceof schiff)
    ) {
      gameObject[0].goto(change.gotox, change.gotoy);
    }
    if (
      change.settle == true &&
      (gameObject[0] instanceof armee || gameObject[0] instanceof schiff)
    ) {
      gameObject[0].settleMerge(this);
    }
  }

  async end(a: number) {
    await this.save(this);
    process.exit(a);
  }

  async save(game: gamelogic) {
    let data = game.getUpdate();
    await writeFile('./save.json', data);
    // console.log('Autosave!');
  }

  async gameloop(game: gamelogic) {
    // console.log("Looped");

    // console.log(game);

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

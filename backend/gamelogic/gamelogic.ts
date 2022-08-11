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

export class gamelogic {
  gameObjects: (armee | stadt | schiff)[];
  map?: mapMini;

  constructor() {
    this.gameObjects = [];

    this.importGameObjects().then(() => {
      setmap().then((mapi) => {
        this.map = mapi;
        console.log(this.gameObjects);
        setInterval(this.gameloop, 100, this);
        setInterval(this.save, 5000, this);
        // setTimeout(this.gameloop, 1000,this);
        console.log('Game Startet');
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
            element.id,
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
            element.id,
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
            element.id,
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

  doesCapitolExist(owner: number) {
    let filterd = this.gameObjects.some((e): boolean => {
      return e instanceof stadt && e.owner == owner && e.capital;
    });
    if (filterd) {
      return true;
    } else {
      return false;
    }
  }

  doesExistAtAll(owner: number) {
    let filterd = this.gameObjects.some((e): boolean => {
      return e.owner == owner;
    });
    if (filterd) {
      return true;
    } else {
      return false;
    }
  }

  addCapitol(owner: number) {
    if (this.map == undefined) return;
    let capital = new stadt(
      makeRandomInt(50, this.map.width),
      makeRandomInt(50, this.map.height),
      owner,
      undefined,
      -1,
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
          id: element.id,
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
          id: element.id,
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
          id: element.id,
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

  update(chang: changes,id?:number) {
    let gameObject = this.gameObjects.filter((arm) => arm.id == chang.id);

    if (
      chang.gotox != undefined &&
      chang.gotoy != undefined &&
      (gameObject[0] instanceof armee || gameObject[0] instanceof schiff)
    ) {
      gameObject[0].goto(chang.gotox, chang.gotoy);
    }
    if (chang.settle==true && (gameObject[0] instanceof armee || gameObject[0] instanceof schiff)) {
      console.log("tes")
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

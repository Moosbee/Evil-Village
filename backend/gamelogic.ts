import { readFile, writeFile } from 'fs/promises';
import { config } from '../config';
import { changes, mapMini, saveFile, setmap } from './serverutilities';
import { armee } from './serverarmee';
import { schiff } from './serverschiff';
import { stadt } from './serverstadt';

export class game {
  gameObjects: (armee | stadt | schiff)[];
  map?: mapMini;

  constructor() {
    this.gameObjects = [];

    this.importGameObjects().then(() => {
      setmap().then((mapi) => {
        map = mapi;
        console.log(this.gameObjects);
        setInterval(this.gameloop, 100);
        setInterval(this.save, 5000);
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
      gameObjects.push(savedObject);
    }
  }

  doesCapitolExist(owner: number) {}

  addCapitol(owner: number) {}

  addStadt(){}
  addArmy(){}
  addSchiff(){}

  getUpdate(): string {
    let savedObjects: saveFile[] = [];

    for (let i = 0; i < gameObjects.length; i++) {
      const element = gameObjects[i];
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

  update(changes: changes[]) {
    for (let i = 0; i < changes.length; i++) {
      let chang: changes = changes[i];
      let gameObject = this.gameObjects.filter((arm) => arm.id == chang.id);

      if (
        chang.gotox != undefined &&
        chang.gotoy != undefined &&
        gameObject[0] instanceof armee
      ) {
        gameObject[0].goto(chang.gotox, chang.gotoy);
      }

      if (chang.settle && gameObject[0] instanceof stadt) {
        gameObject[0].settle();
      }
    }
  }

  async end(a: number) {
    await this.save();
    process.exit(a);
  }

  async save() {
    let data = this.getUpdate();;
    await writeFile('./save.json', data);
    console.log('Saved!');
  }

  gameloop() {
    //console.log("Looped");

    for (let i = 0; i < this.gameObjects.length; i++) {
      let stadt = this.gameObjects[i];

      stadt.setarraypos(i);
      stadt.tick();
      //stadt.drew();
    }
  }
}

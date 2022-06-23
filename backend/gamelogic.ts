import { readFile } from "fs/promises";
import { config } from "../config";
import { mapMini } from "./serverutilities";
import { armee } from "./serverarmee";
import { schiff } from "./serverschiff";
import { stadt } from "./serverstadt";

declare global {
  var map: mapMini;
}
export class game {
  gameObjects:(armee|stadt|schiff)[]
  
  constructor() {
    this.gameObjects=[];

    this.importGameObjects();
  }
  
  async importGameObjects(){

    let savedGame:string;

    try{

      savedGame= await readFile(config.rootPath+config.Game.saveFile,{encoding:"utf8"});
    }catch(e:Error){
      savedGame="[]";
      throw new Error(e);
    }



if (savedGame == '' || config.Game.ResetOnStart) {
  savedGame = '[]';
}



let res:(armee|stadt|schiff)[] = JSON.parse(savedGame);
for (let index = 0; index < res.length; index++) {
  const element = res[index];
  if (element.type == 'stadt') {
    if (element.search) {
      this.gameObjects.push(
        new stadt(
          element.x,
          element.y,
          element.owner,
          element.capital,
          element.strength,
          element.id,
          element.size,
          element.makingofarmy,
          element.speed,
          element.population,
          element.search
        )
      );
    } else {
      this.gameObjects.push(
        new stadt(
          element.x,
          element.y,
          element.owner,
          element.capital,
          element.strength,
          element.id,
          element.size,
          element.makingofarmy,
          element.speed,
          element.population
        )
      );
    }
    this.gameObjects[this.gameObjects.length - 1].arraypos = this.gameObjects.length - 1;
  } else {
    this.gameObjects.push(
      new armee(
        element.x,
        element.y,
        element.owner,
        element.strength,
        element.id,
        element.size,
        element.gotox,
        element.gotoy,
        element.move,
        element.a,
        element.b
      )
    );
    this.gameObjects[this.gameObjects.length - 1].arraypos = this.gameObjects.length - 1;
  }
}

console.log(this.gameObjects);
setInterval(this.gameloop, 100);
setInterval(this.save, 5000);
console.log('Game Startet');
  }

  doesCapitolExist(id: number) {}

  createCapitol(id: number) {}

  getUpdate(): string {
    return '[]';
  }

  update(text: any) {
    for (let i = 0; i < changes.length; i++) {
      let chang = changes[i];
      let selectthis.gameObjects = this.gameObjects.filter((arm) => arm.id == chang.id);

      if (!(chang.gotox == -1 && chang.gotoy == -1)) {
        selectthis.gameObjects[0].goto(chang.gotox, chang.gotoy);
      }

      if (chang.settele) {
        selectthis.gameObjects[0].settle();
      }
    }
  }

  end(a: number) {
    let data = JSON.stringify(global.this.gameObjects);
    console.log(data);
    fs.writeFile('./save.json', data, function (err: Error) {
      if (err) throw err;
      console.log('Saved!');
      process.exit(a);
    });
  }

  save() {
    let data = JSON.stringify(global.this.gameObjects);
    fs.writeFile('./save.json', data, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  }

  gameloop() {
    //console.log("Looped");

    for (let sein = 0; sein < this.gameObjects.length; sein++) {
      let stadt = this.gameObjects[sein];

      stadt.setarraypos(sein);
      stadt.tick();
      //stadt.drew();
      stadt.remove();
    }
  }
}

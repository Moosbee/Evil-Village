import { gameobject } from './gameobject';
import { armee } from './serverarmee';
import { schiff } from './serverschiff';

declare global {
  // var gameObjects: armee[];
  var gameObjects: (armee | stadt | schiff)[];
}
export class stadt extends gameobject {
  capital: boolean;
  speed: number;
  population: number;
  makingofarmy: number;

  constructor(
    x: number,
    y: number,
    owner: number,
    strength?: number,
    id: number = -1,
    population: number = -1,
    size: number = 40,
    capital: boolean = false,
    speed?: number,
    makingofarmy?: number
  ) {
    if (strength == undefined) strength = 1;
    super(x, y, owner, id, strength, size);

    let min = 1;
    let max = 1;

    this.capital = capital;
    this.makingofarmy = makingofarmy == undefined ? 500 : makingofarmy;
    max = 6;
    this.speed =
      speed == undefined
        ? Math.floor(Math.random() * (max - min)) + min
        : speed;

    if (capital) {
      this.capital = true;
      this.size = 60;
      min = 40;
      max = 50;
      this.strength = Math.floor(Math.random() * (max - min)) + min;
      min = 750;
      max = 1000;
      this.population = Math.floor(Math.random() * (max - min)) + min;
    } else {
      max = 101;
      this.population =
        population == undefined
          ? Math.floor(Math.random() * (max - min)) + min
          : population;
    }
  }
  settle() {}

  tick() {
    let armee = require('./serverarmee');
    this.makingofarmy = this.makingofarmy - 1;
    if (this.makingofarmy < 0) {
      this.makingofarmy =
        Math.floor(Math.random() * (1000 - 100)) + 100 + this.strength / 2;
      if (this.capital) {
        this.makingofarmy =
          Math.floor(Math.random() * (1000 - 100)) + 100 + this.strength / 2;
      }
      let max = 150;
      let min = -150;
      let x = Math.floor(Math.random() * (max - min)) + min;
      let y = Math.floor(Math.random() * (max - min)) + min;
      globalThis.gameObjects.push(new armee(this.x, this.y, this.owner));
      globalThis.gameObjects[globalThis.gameObjects.length - 1].arraypos = globalThis.gameObjects.length - 1;
      globalThis.gameObjects[globalThis.gameObjects.length - 1].gotox = this.x + x;
      globalThis.gameObjects[globalThis.gameObjects.length - 1].gotoy = this.y + y;
      min = this.strength - this.strength / 25;
      max = this.strength + this.strength / 20;
      globalThis.gameObjects[globalThis.gameObjects.length - 1].strength =
        Math.floor(Math.random() * (max - min)) + min;
      if (this.strength / 2 > this.population) {
        globalThis.gameObjects[globalThis.gameObjects.length - 1].strength = globalThis.gameObjects[globalThis.gameObjects.length - 1].strength;
        let max = 150;
        let min = -150;
        let x = Math.floor(Math.random() * (max - min)) + min;
        let y = Math.floor(Math.random() * (max - min)) + min;
        globalThis.gameObjects.push(new armee(this.x + 100, this.y + 100, this.owner));
        globalThis.gameObjects[globalThis.gameObjects.length - 1].arraypos = globalThis.gameObjects.length - 1;
        globalThis.gameObjects[globalThis.gameObjects.length - 1].gotox = this.x + x;
        globalThis.gameObjects[globalThis.gameObjects.length - 1].gotoy = this.y + y;
        min = this.strength - this.strength / 25;
        max = this.strength + this.strength / 20;
        globalThis.gameObjects[globalThis.gameObjects.length - 1].strength =
          (Math.floor(Math.random() * (max - min)) + min) / 2;
      }
    }
  }
}

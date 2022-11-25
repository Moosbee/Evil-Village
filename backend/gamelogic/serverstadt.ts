import { gamelogic } from './gamelogic';
import { gameobject } from './gameobject';
import { armee } from './serverarmee';
import { RGBColor } from './serverinterfaces';
import { schiff } from './serverschiff';
import { makeRandomInt } from './serverutilities';

export class stadt extends gameobject {
  capital: boolean;
  speed: number;
  population: number;
  makingofarmy: number;
  production: boolean;

  constructor(
    x: number,
    y: number,
    owner: string,
    color: RGBColor,
    strength?: number,
    name: string = '',
    population: number = -1,
    size: number = 40,
    capital: boolean = false,
    speed?: number,
    makingofarmy?: number,
    production?: boolean
  ) {
    if (strength == undefined) strength = -1;
    super(x, y, owner, color, name, strength, size);

    let min = 1;
    let max = 1;

    this.capital = capital;
    this.makingofarmy = makingofarmy == undefined ? 100 : makingofarmy;
    this.production = production == undefined ? true : production;
    // this.makingofarmy = 100;
    max = 6;
    this.speed = speed == undefined ? makeRandomInt(min, max) : speed;

    if (capital) {
      this.capital = true;
      this.size = 60;
      min = 4000;
      max = 50000;
      this.setStrength = makeRandomInt(min, max);
      min = 750;
      max = 1000;
      this.population = makeRandomInt(min, max);
    } else {
      max = 101;
      this.population =
        population == undefined ? makeRandomInt(min, max) : population;
    }
  }
  settle() {}

  tick(game: gamelogic) {
    this.makingofarmy = this.makingofarmy - 1;
    if (this.makingofarmy < 0) {
      if (this.production) {
        this.createArmy(game, 'schiffe');
        this.makingofarmy = makeRandomInt(100, 1000) + this.strength / 2;
      } else {
        this.makingofarmy = 0;
      }
    }
  }

  createArmy(game: gamelogic, type: 'army' | 'schiffe') {
    let max = 150;
    let min = -150;
    let x = makeRandomInt(min, max);
    let y = makeRandomInt(min, max);
    // let newArmy: armee = new armee(this.x + 100, this.y + 100, this.owner);
    let newArmy: armee | schiff =
      type == 'army'
        ? new armee(this.x + x, this.y + y, this.owner, this.color)
        : new schiff(this.x + x, this.y + y, this.owner, this.color);
    x = makeRandomInt(min, max);
    y = makeRandomInt(min, max);
    newArmy.arraypos = game.gameObjects.length;
    newArmy.gotox = this.x + x;
    newArmy.gotoy = this.y + y;
    min = this.strength - this.strength / 25;
    max = this.strength + this.strength / 20;
    newArmy.setStrength = Math.floor(makeRandomInt(min, max) / 2);

    game.gameObjects.push(newArmy);
    if (this.strength / 2 > this.population) {
      let max = 150;
      let min = -150;
      let x = makeRandomInt(min, max);
      let y = makeRandomInt(min, max);
      let newSecondArmy: armee = new armee(
        this.x + x,
        this.y + y,
        this.owner,
        this.color
      );
      x = makeRandomInt(min, max);
      y = makeRandomInt(min, max);
      newSecondArmy.arraypos = game.gameObjects.length + 1;
      newSecondArmy.gotox = this.x + x;
      newSecondArmy.gotoy = this.y + y;
      min = this.strength - this.strength / 25;
      max = this.strength + this.strength / 20;
      newSecondArmy.setStrength = Math.floor(makeRandomInt(min, max) / 2);
      game.gameObjects.push(newSecondArmy);
    }
  }

  settleMerge(game: gamelogic) {
    this.mobilize(game, 'army');
  }

  mobilize(game: gamelogic, type: 'army' | 'schiffe') {
    if (this.capital) return;
    // let newArmy: armee = new armee(this.x + 100, this.y + 100, this.owner);
    let newArmy: armee | schiff =
      type == 'army'
        ? new armee(
            this.x,
            this.y,
            this.owner,
            this.color,
            Math.floor(this.strength / 2),
            this.name
          )
        : new schiff(
            this.x,
            this.y,
            this.owner,
            this.color,
            Math.floor(this.strength / 2),
            this.name
          );
    newArmy.arraypos = game.gameObjects.length;

    game.gameObjects.push(newArmy);
    this.selfKill();
  }
}

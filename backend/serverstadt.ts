import { gamelogic } from './gamelogic';
import { gameobject } from './gameobject';
import { armee } from './serverarmee';
import { schiff } from './serverschiff';
import { makeRamdomInt } from './serverutilities';

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
    this.makingofarmy = 100;
    max = 6;
    this.speed = speed == undefined ? makeRamdomInt(min, max) : speed;

    if (capital) {
      this.capital = true;
      this.size = 60;
      min = 40;
      max = 50;
      this.strength = makeRamdomInt(min, max);
      min = 750;
      max = 1000;
      this.population = makeRamdomInt(min, max);
    } else {
      max = 101;
      this.population =
        population == undefined ? makeRamdomInt(min, max) : population;
    }
  }
  settle() {}

  tick(game: gamelogic) {
    this.makingofarmy = this.makingofarmy - 1;
    if (this.makingofarmy < 0) {
      this.createArmy(game, 'army');
      this.makingofarmy = makeRamdomInt(100, 1000) + this.strength / 2;
    }
  }

  createArmy(game: gamelogic, type: 'army' | 'schiff') {
    let max = 150;
    let min = -150;
    let x = makeRamdomInt(min, max);
    let y = makeRamdomInt(min, max);
    // let newArmy: armee = new armee(this.x + 100, this.y + 100, this.owner);
    let newArmy: armee | schiff =
      type == 'army'
        ? new armee(this.x + 100, this.y + 100, this.owner)
        : new schiff(this.x + 100, this.y + 100, this.owner);
    newArmy.arraypos = game.gameObjects.length;
    newArmy.gotox = this.x + x;
    newArmy.gotoy = this.y + y;
    min = this.strength - this.strength / 25;
    max = this.strength + this.strength / 20;
    newArmy.strength = makeRamdomInt(min, max) / 2;

    if (this.strength / 2 > this.population) {
      game.gameObjects.push(newArmy);
      let max = 150;
      let min = -150;
      let x = makeRamdomInt(min, max);
      let y = makeRamdomInt(min, max);
      let newSecondArmy: armee = new armee(
        this.x + 100,
        this.y + 100,
        this.owner
      );
      newSecondArmy.arraypos = game.gameObjects.length;
      newSecondArmy.gotox = this.x + x;
      newSecondArmy.gotoy = this.y + y;
      min = this.strength - this.strength / 25;
      max = this.strength + this.strength / 20;
      newSecondArmy.strength = makeRamdomInt(min, max) / 2;
      game.gameObjects.push(newSecondArmy);
    } else {
      game.gameObjects.push(newArmy);
    }
  }
}

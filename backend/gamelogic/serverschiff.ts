import chalk from 'chalk';
import config from '../config';
import { gamelogic } from './gamelogic';
import { getPixelMovementMultiplier } from './gamemap';
import { gameobject } from './gameobject';
import { armee } from './serverarmee';
import { RGBColor } from './serverinterfaces';
import { stadt } from './serverstadt';
import { makeRandomInt } from './serverutilities';

export class schiff extends gameobject {
  gotox: number;
  gotoy: number;
  public ismoving: boolean;
  movex: number;
  movey: number;
  constructor(
    x: number,
    y: number,
    owner: string,
    color: RGBColor,
    strength: number = -1,
    name: string = '',
    size = 50,
    gotox = -1,
    gotoy = -1,
    ismoving = false,
    movex = 0,
    movey = 0
  ) {
    super(x, y, owner, color, name, strength, size);
    this.arraypos = 0;
    this.owner = owner;
    this.selected = false;

    if (gotox == -1 && gotoy == -1) {
      this.gotox = x;
      this.gotoy = y;
    } else {
      this.gotox = gotox;
      this.gotoy = gotoy;
    }
    this.ismoving = ismoving;
    this.movey = movey;
    this.movex = movex;
  }
  settleMerge(game: gamelogic) {
    if (this.merge(game)) return;
    if (this.strength > 500) {
      this.settle(game);
    } else {
      console.log(chalk.red('fehlgeschlagen'));
    }
  }

  settle(game: gamelogic) {
    let min = this.strength - 100;
    let max = this.strength + 100;
    let population = makeRandomInt(min, max);
    game.gameObjects.push(
      new stadt(
        this.x,
        this.y,
        this.owner,
        this.color,
        this.strength,
        this.name,
        population
      )
    );

    game.gameObjects[game.gameObjects.length - 1].arraypos =
      game.gameObjects.length - 1;

    this.selfKill();
  }

  merge(game: gamelogic): boolean {
    let selectgameObjects: (armee | stadt | schiff)[] = game.gameObjects.filter(
      (arm) =>
        arm instanceof stadt &&
        this.x > arm.x - this.size / 2 &&
        this.x < arm.x + this.size / 2 &&
        this.y > arm.y - this.size / 2 &&
        this.y < arm.y + this.size / 2
    );

    if (selectgameObjects.length > 0) {
      if (selectgameObjects[0] instanceof stadt) {
        let selectgameObject: stadt = selectgameObjects[0];
        selectgameObject.setStrength =
          selectgameObject.strength + this.strength;

        selectgameObject.makingofarmy = 100;
        this.selfKill();
        console.log(chalk.cyan('Merge'));
      }
      return true;
    }
    return false;
  }

  goto(gotox: number, gotoy: number) {
    this.gotox = gotox;
    this.gotoy = gotoy;
    this.movey = 0;
    this.movex = 0;
  }

  tick(game: gamelogic) {
    if (this.x == this.gotox && this.y == this.gotoy) return;

    this.move(game);

    let selectgameObject = game.gameObjects.filter(
      (arm) =>
        this.x > arm.x - this.size / 2 &&
        this.x < arm.x + this.size / 2 &&
        this.y > arm.y - this.size / 2 &&
        this.y < arm.y + this.size / 2
    );

    for (let i = 0; i < selectgameObject.length; i++) {
      this.interact(selectgameObject[i]);
    }
  }
  move(game: gamelogic) {
    if (
      this.x > this.gotox - 5 &&
      this.x < this.gotox + 5 &&
      this.y > this.gotoy - 5 &&
      this.y < this.gotoy + 5
    ) {
      this.x = this.gotox;
      this.y = this.gotoy;
      this.ismoving = false;
      console.log(chalk.cyan('Angekommen'));
      return;
    }
    this.ismoving = true;

    if (this.movey == 0 && this.movex == 0) {
      console.log(chalk.cyan('startwalk'));
      let a = this.y - this.gotoy;
      let b = -(this.x - this.gotox);
      let alpha = Math.atan2(a, b); //G/A
      if (a < 0) {
        alpha = 2 * Math.PI + alpha;
      }

      a = Math.sin(alpha);
      b = Math.cos(alpha);
      a = a * config.GAME.RUNSPEED;
      b = b * config.GAME.RUNSPEED;

      this.movey = a;
      this.movex = b;
      this.x = this.x + b;
      this.y = this.y - a;
    } else {
      let movementMultiplier = getPixelMovementMultiplier(
        this.x,
        this.y,
        'schiffe',
        game.map
      );

      this.x = this.x + this.movex * (movementMultiplier / this.strength + 1);
      this.y = this.y - this.movey * (movementMultiplier / this.strength + 1);
    }
  }

  interact(arm: armee | stadt | schiff) {
    if (this.arraypos == arm.arraypos) {
      return;
    }
    if (this.owner == arm.owner) {
      if (arm instanceof stadt) {
        return;
      }
      console.log(chalk.cyan('merge'));
      if (this.strength < arm.strength) {
        arm.setStrength = arm.strength + this.strength;
        this.selfKill();
      } else if (this.strength > arm.strength) {
        this.setStrength = this.strength + arm.strength;
        arm.selfKill();
      } else {
        this.setStrength = this.strength + arm.strength;
        arm.selfKill();
      }
      return;
    }

    console.log(chalk.cyan('Kampf'));
    if (this.strength != arm.strength) {
      let strengthtthis = this.strength;
      let strengthtarm = arm.strength;
      this.setStrength = this.strength - strengthtarm;
      arm.setStrength = arm.strength - strengthtthis;
    } else {
      this.selfKill();
      arm.selfKill();
      console.log(chalk.cyan('Unentschieden'));
    }
  }
}

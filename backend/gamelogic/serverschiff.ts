import { config } from '../config';
import { gamelogic } from './gamelogic';
import { gameobject } from './gameobject';
import { armee } from './serverarmee';
import { stadt } from './serverstadt';
import { getMapPixel, makeRandomInt } from './serverutilities';

export class schiff extends gameobject {
  gotox: number;
  gotoy: number;
  public ismoving: boolean;
  movex: number;
  movey: number;
  constructor(
    x: number,
    y: number,
    owner: number,
    strength: number = -1,
    id: number = -1,
    size = 50,
    gotox = -1,
    gotoy = -1,
    ismoving = false,
    movex = 0,
    movey = 0
  ) {
    super(x, y, owner, strength, id, size);
    this.arraypos = 0;
    this.strength = strength;
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
      console.log('fehlgeschlagen');
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
        this.strength,
        undefined,
        population
      )
    );

    game.gameObjects[game.gameObjects.length - 1].arraypos =
      game.gameObjects.length - 1;

    this.strength = -1;
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
        selectgameObject.strength = selectgameObject.strength + this.strength;
        selectgameObject.makingofarmy = 100;
        this.strength = -1;
        console.log('Merge');
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
    this.strength = this.strength + 1 / 1000;

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
      console.log('Angekommen');
      return;
    }
    this.ismoving = true;

    if (this.movey == 0 && this.movex == 0) {
      console.log('startwalk');
      let a = this.y - this.gotoy;
      let b = -(this.x - this.gotox);
      let alpha = Math.atan2(a, b); //G/A
      if (a < 0) {
        alpha = 2 * Math.PI + alpha;
      }

      a = Math.sin(alpha);
      b = Math.cos(alpha);
      a = a * config.Game.runspeed;
      b = b * config.Game.runspeed;

      this.movey = a;
      this.movex = b;
      this.x = this.x + b;
      this.y = this.y - a;
    } else {
      let rgb = getMapPixel(this.x, this.y, game.map);
      let movmentMultiplierer: number;
      if (rgb.red == 0 && rgb.green == 0 && rgb.blue == 255) {
        movmentMultiplierer = 0.5;
      } else if (rgb.red == 125 && rgb.green == 255 && rgb.blue == 125) {
        movmentMultiplierer = 0.75;
      } else if (rgb.red == 188 && rgb.green == 255 && rgb.blue == 188) {
        movmentMultiplierer = 0.5;
      } else if (rgb.red == 220 && rgb.green == 255 && rgb.blue == 220) {
        movmentMultiplierer = 0.25;
      } else {
        movmentMultiplierer = 1;
      }
      this.x = this.x + this.movex * (movmentMultiplierer / this.strength + 1);
      this.y = this.y - this.movey * (movmentMultiplierer / this.strength + 1);
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
      console.log('merge');
      if (this.strength < arm.strength) {
        arm.strength = arm.strength + this.strength;
        this.strength = -1;
      } else if (this.strength > arm.strength) {
        this.strength = this.strength + arm.strength;
        arm.strength = -1;
      } else {
        this.strength = this.strength + arm.strength;
        arm.strength = -1;
      }
      return;
    }

    console.log('Kampf');
    if (this.strength != arm.strength) {
      let strengthtthis = this.strength;
      let strengthtarm = arm.strength;
      this.strength = this.strength - strengthtarm;
      arm.strength = arm.strength - strengthtthis;
    } else {
      this.strength = -1;
      arm.strength = -1;
      console.log('Unentschieden');
    }
  }
}

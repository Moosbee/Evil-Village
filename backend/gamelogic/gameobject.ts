import { gamelogic } from './gamelogic';
import { genName, makeRandomInt } from './serverutilities';

export class gameobject {
  public name: string = '';
  public arraypos?: number;
  public x: number;
  public y: number;
  public owner: string;
  public strength: number = -1;
  public selected: boolean;
  public size: number = 50;
  constructor(
    x: number,
    y: number,
    owner: string,
    name: string,
    strength?: number,
    size?: number
  ) {
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.selected = false;

    if (name == '') {
      name = genName();
    }
    this.name = name;

    let min = 1;
    min = 10;
    let max = 35;
    if (strength == undefined || strength == -1) {
      this.setStrength=makeRandomInt(min, max);
    } else {
      this.setStrength =strength;
    }
    if (size != undefined) {
      this.size = size;
    }
  }

  tick(game: gamelogic) {}
  set setStrength(newStrength: number) {
    this.strength = newStrength;
  }
  selfKill() {
    this.strength = -1;
  }
  setarraypos(a: number) {
    this.arraypos = a;
  }
}

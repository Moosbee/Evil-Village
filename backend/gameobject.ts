import { config } from "../config";

export class gameobject {
  public id: number;
  public arraypos?: number;
  public x: number;
  public y: number;
  public owner: number;
  public strength: number;
  public selected: boolean;
  public size: number = 50;
  constructor(
    x: number,
    y: number,
    owner: number,
    id: number,
    strength?: number,
    size?: number
  ) {
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.selected = false;

    let min = 1;
    if (id == -1) {
      this.id = Math.floor(Math.random() * (config.Game.maxGameObjects - min)) + min;
    } else {
      this.id = id;
    }
    min = 10;
    let max = 35;
    if (strength == undefined || strength == -1) {
      this.strength = Math.floor(Math.random() * (max - min)) + min;
    } else {
      this.strength = strength;
    }
    if (size != undefined) {
      this.size = size;
    }
  }
  tick() {}
  setarraypos(a: number) {
    this.arraypos = a;
  }
}

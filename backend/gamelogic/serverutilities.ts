import names from '../names.json';
import { RGBColor } from './serverinterfaces';

// declare var map: mapMini;

function makeRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function genName(): string {
  let name = generateName();
  name = name + makeRandomInt(1000, 9999).toString();
  return name;
}

function capFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateName() {
  let name1 = names.names1;

  let name = name1[makeRandomInt(0, name1.length)];
  return name;
}

function genColor(): RGBColor {
  return {
    blue: makeRandomInt(1, 254),
    green: makeRandomInt(1, 254),
    red: makeRandomInt(1, 254),
  };
}

export { makeRandomInt, genName, genColor };

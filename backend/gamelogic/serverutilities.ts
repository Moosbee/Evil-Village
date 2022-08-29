import { config } from '../config';
import Jimp from 'jimp';
import path from 'path';
import chalk from 'chalk';

interface RGBColor {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}
interface mapMini {
  pixels: Buffer;
  width: number;
  height: number;
  set?: boolean;
}

interface changes {
  name: string;
  gotox?: number;
  gotoy?: number;
  settle?: boolean;
}

interface saveFile {
  name: string;
  x: number;
  y: number;
  owner: string;
  strength: number;
  size: number;
  typeof: saveArmy | saveSchiff | saveStadt;
}

interface saveArmy {
  type: 'saveArmy';
  gotox: number;
  gotoy: number;
}
interface saveSchiff {
  type: 'saveSchiff';
  gotox: number;
  gotoy: number;
}
interface saveStadt {
  type: 'saveStadt';
  capital: boolean;
  speed: number;
  population: number;
  makingofarmy: number;
}

// declare var map: mapMini;

async function setmap(): Promise<mapMini> {
  console.log(chalk.gray('Setting Map'));
  let mapDir = config.rootPath + './maps/';
  mapDir = mapDir + config.Game.MapFileName;

  let image: Jimp;
  try {
    image = await Jimp.read(path.normalize(mapDir));
  } catch (e) {
    throw console.error(e);
  }
  console.log(chalk.gray('Map Set'));
  return {
    pixels: image.bitmap.data,
    height: image.getHeight(),
    width: image.getHeight(),
    set: true,
  };
}

//image.getPixelColor(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
function getMapPixel(x: number, y: number, map: mapMini | undefined): RGBColor {
  if (map == undefined || map.set == undefined || map.set == false || !map) {
    setmap().then((map) => {
      map = map;
    });
    return {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 0,
    };
  }

  x = Math.round(x);
  y = Math.round(y);
  let indexred = y * (map.width * 4) + x * 4;
  let indexgreen = indexred + 1;
  let indexblue = indexred + 2;
  let indexalpha = indexred + 3;

  let pixel: RGBColor = {
    red: map.pixels[indexred],
    green: map.pixels[indexgreen],
    blue: map.pixels[indexblue],
    alpha: map.pixels[indexalpha],
  };
  return pixel;
}

function makeRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function genName(): string {
  let name = 'Test';
  name = name + Math.random().toString();
  return name;
}

export { setmap, getMapPixel, makeRandomInt,genName, saveFile, changes, mapMini };

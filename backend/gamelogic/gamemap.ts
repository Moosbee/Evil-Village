import config from '../config';
import Jimp from 'jimp';
import path from 'path';
import chalk from 'chalk';
import { mapFile, mapMini, RGBColor } from './serverinterfaces';
import { readFile } from 'fs/promises';

async function setMap(): Promise<mapMini> {
  console.log(chalk.gray('Setting Map'));
  const mapDir = config.ROOTPATH + './maps/';
  const mapConfFile = mapDir + config.GAME.MAPFILENAME + '.json';

  const mapConf: mapFile = JSON.parse(
    await readFile(path.normalize(mapConfFile), { encoding: 'utf-8' })
  );

  let image: Jimp;
  try {
    image = await Jimp.read(path.normalize(mapDir + mapConf.mapSRC));
  } catch (e) {
    throw console.error(e);
  }
  console.log(chalk.gray('Map Set'));

  return {
    set: true,
    pixels: image.bitmap.data,
    height: image.getHeight(),
    width: image.getHeight(),
    mapSRC: mapConf.mapSRC,
    description: mapConf.description,
    defaultMovementMultiplier: mapConf.defaultMovementMultiplier,
    colors: mapConf.colors,
  };
}

//image.getPixelColor(x, y); // returns the color of that pixel e.g. 0xFFFFFFFF
function getMapPixel(x: number, y: number, map: mapMini): RGBColor {
  x = Math.round(x);
  y = Math.round(y);
  const indexRed = y * (map.width * 4) + x * 4;
  const indexGreen = indexRed + 1;
  const indexBlue = indexRed + 2;
  const indexAlpha = indexRed + 3;

  const pixel: RGBColor = {
    red: map.pixels[indexRed],
    green: map.pixels[indexGreen],
    blue: map.pixels[indexBlue],
    alpha: map.pixels[indexAlpha],
  };
  return pixel;
}

function getPixelMovementMultiplier(
  x: number,
  y: number,
  type: 'army' | 'schiffe',
  map: mapMini | undefined
): number {
  if (map == undefined || map.set == undefined || map.set == false || !map) {
    return 1;
  }
  const color = getMapPixel(x, y, map);

  let movementMultiplier: number = map.defaultMovementMultiplier;

  for (let i = 0; i < map.colors.length; i++) {
    const mapColor = map.colors[i];
    if (
      mapColor.color.red == color.red &&
      mapColor.color.green == color.green &&
      mapColor.color.blue == color.blue
    ) {
      movementMultiplier = mapColor.movementMultiplier;
    }
  }

  return movementMultiplier;
}

function isWater(x: number, y: number, map: mapMini | undefined): boolean {
  if (map == undefined || map.set == undefined || map.set == false || !map) {
    return false;
  }
  const color = getMapPixel(x, y, map);

  for (let i = 0; i < map.colors.length; i++) {
    const mapColor = map.colors[i];
    if (
      mapColor.isWater &&
      mapColor.color.red == color.red &&
      mapColor.color.green == color.green &&
      mapColor.color.blue == color.blue
    ) {
      return true;
    }
  }

  return false;
}

export { setMap, getPixelMovementMultiplier, isWater };

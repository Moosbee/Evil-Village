import { config } from '../config';
import Jimp from 'jimp';

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

// declare var map: mapMini;

async function setmap(): Promise<mapMini> {
  console.log('Setting Map');
  let mapDir = config.rootPath + './both/maps/map_';
  let mapNumber: number = config.Game.Map;
  mapDir = mapDir + mapNumber + '.png';

  let image: Jimp;
  try {
    image = await Jimp.read(mapDir);
  } catch (e) {
    throw console.error(e);
  }
  return {
    pixels: image.bitmap.data,
    height: image.getHeight(),
    width: image.getHeight(),
    set: true,
  };
}

//image.getPixelColor(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
function getMapPixel(x: number, y: number): RGBColor {
  if (
    globalThis.map == undefined ||
    globalThis.map.set == undefined ||
    globalThis.map.set == false ||
    !globalThis.map
  ) {
    setmap().then((map) => {
      globalThis.map = map;
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
  let indexred = y * (globalThis.map.width * 4) + x * 4;
  let indexgreen = indexred + 1;
  let indexblue = indexred + 2;
  let indexalpha = indexred + 3;

  let pixel: RGBColor = {
    red: globalThis.map.pixels[indexred],
    green: globalThis.map.pixels[indexgreen],
    blue: globalThis.map.pixels[indexblue],
    alpha: globalThis.map.pixels[indexalpha],
  };
  return pixel;
}

export { setmap, getMapPixel, mapMini };

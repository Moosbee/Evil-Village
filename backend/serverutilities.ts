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

var map: mapMini;

async function setmap(): Promise<mapMini> {
  console.log("Setting Map")
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
    set:true
  };
}

//image.getPixelColor(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
async function getMapPixel(x: number, y: number): Promise<RGBColor> {
  if (map==undefined || map.set == undefined || map.set == false) {
    map = await setmap();
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

export { getMapPixel };

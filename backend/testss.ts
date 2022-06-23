import { verify } from './auth';
import { getMapPixel, mapMini, setmap } from './serverutilities';

// const verify = require('./auth');

declare global {
  var map: mapMini;
}

let pixel = getMapPixel(200, 200);
console.log(pixel);
verify('west', 'mm').then((erg) => {
  console.log(erg);
});
console.log(getMapPixel(200, 200));

interface RGBColor {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}
interface mapMini {
  set?: boolean;
  mapSRC: string;
  smallMapSRC?: string;
  pixels: Buffer;
  width: number;
  height: number;
  description: string;
  defaultMovementMultiplier: number;
  colors: {
    color: RGBColor;
    isWater: boolean;
    movementMultiplier: number;
  }[];
}

interface changes {
  name: string;
  gotox?: number;
  gotoy?: number;
  settle?: boolean;
  newName?: string;
  toggleArmy?: boolean;
}

interface saveFile {
  name: string;
  x: number;
  y: number;
  owner: string;
  color: RGBColor;
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
  production: boolean;
}

interface mapFile {
  smallMapSRC?: string;
  mapSRC: string;
  description: string;
  defaultMovementMultiplier: number;
  colors: {
    color: RGBColor;
    isWater: boolean;
    movementMultiplier: number;
  }[];
}

export { saveFile, changes, mapMini, RGBColor, mapFile };

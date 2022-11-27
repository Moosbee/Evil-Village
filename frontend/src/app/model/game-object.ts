export interface GameObject {
  name: string;
  x: number;
  y: number;
  owner: string;
  color: RGBColor;
  strength: number;
  size: number;
  typeof: GameObjectArmy | GameObjectSchiff | GameObjectStadt;
}

interface GameObjectArmy {
  type: 'saveArmy';
  gotox: number;
  gotoy: number;
}
interface GameObjectSchiff {
  type: 'saveSchiff';
  gotox: number;
  gotoy: number;
}
interface GameObjectStadt {
  type: 'saveStadt';
  capital: boolean;
  speed: number;
  population: number;
  makingofarmy: number;
  production: boolean;
}

interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

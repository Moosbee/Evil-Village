export interface GameObject {
  name: string;
  x: number;
  y: number;
  owner: string;
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
  production:boolean;
}

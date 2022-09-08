export interface Update {
  name: string;
  x: number;
  y: number;
  owner: string;
  strength: number;
  size: number;
  typeof: UpdateArmy | UpdateSchiff | UpdateStadt;
}

interface UpdateArmy {
  type: 'saveArmy';
  gotox: number;
  gotoy: number;
}
interface UpdateSchiff {
  type: 'saveSchiff';
  gotox: number;
  gotoy: number;
}
interface UpdateStadt {
  type: 'saveStadt';
  capital: boolean;
  speed: number;
  population: number;
  makingofarmy: number;
  production:boolean;
}

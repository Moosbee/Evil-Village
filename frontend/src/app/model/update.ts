import { Stats } from './stats';
import { GameObject } from './game-object';

export interface Update {
  gameObjects: GameObject[];
  menuEntries: GameObject[];
  stats?: Stats;
}

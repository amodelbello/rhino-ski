import Item from './ItemType';
import { ObstacleType } from './Enum';

export default interface Obstacle extends Item {
  type: ObstacleType;
}

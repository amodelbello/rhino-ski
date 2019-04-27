import Item from './ItemType';
import { Direction } from './Enum';

export default interface Character extends Item {
  direction: Direction;
  isMoving: boolean;
}

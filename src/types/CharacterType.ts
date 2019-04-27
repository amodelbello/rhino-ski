import Item from './ItemType';
import { Direction } from './DirectionEnum';

export default interface Character extends Item {
  currentImage: string;
  currentDirection: Direction;
  isMoving: boolean;
  xPosition: number;
  yPosition: number;
}

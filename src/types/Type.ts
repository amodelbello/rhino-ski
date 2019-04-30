import { Direction, ObstacleType } from './Enum';

export interface Item {
  image: CanvasImageSource;
  xPosition: number;
  yPosition: number;
}

export interface Character extends Item {
  direction: Direction;
  speed: number;
  isMoving: boolean;
  isJumping?: boolean;
  isEating?: boolean;
}

export interface Obstacle extends Item {
  type: ObstacleType;
}

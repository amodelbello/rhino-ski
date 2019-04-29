import Game from './Game';
import ObstacleModel from '../types/ObstacleType';
import { ObstacleType } from '../types/Enum';
import { randomBetween, closeEnough } from './Util';

export default class Obstacle {
  public game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public generateRandomObstacles(
    count: number,
    minX = 0,
    maxX = this.game.canvas.width,
    minY = 0,
    maxY = this.game.canvas.height
  ) {
    const obstacles: ObstacleModel[] = [];
    for (let x = 0; x < count; x++) {
      const obstacleType = this.getRandomObstacleType();
      const [xPosition, yPosition] = this.getRandomObstaclePosition(
        minX,
        maxX,
        minY,
        maxY
      );

      const obstacle = this.initObstacle(obstacleType, xPosition, yPosition);
      obstacles.push(obstacle);
    }

    return obstacles;
  }

  private getRandomObstacleType() {
    const randomNumber = randomBetween(0, 4);
    const obstacleTypes: ObstacleType[] = [
      ObstacleType.Rock1,
      ObstacleType.Rock2,
      ObstacleType.Tree,
      ObstacleType.TreeCluster,
      ObstacleType.Ramp,
    ];

    return obstacleTypes[randomNumber];
  }

  private getRandomObstaclePosition(
    minX = 0,
    maxX = this.game.canvas.width,
    minY = 0,
    maxY = this.game.canvas.height
  ): number[] {
    const xPosition = randomBetween(minX, maxX);
    const yPosition = randomBetween(minY, maxY);

    if (
      closeEnough(xPosition, this.game.hero.xPosition, 50) &&
      closeEnough(yPosition, this.game.hero.yPosition, 50)
    ) {
      return this.getRandomObstaclePosition(minX, maxX, minY, maxY);
    }
    return [xPosition, yPosition];
  }

  private initObstacle(
    obstacleType: ObstacleType,
    xPosition: number,
    yPosition: number
  ): ObstacleModel {
    return {
      type: obstacleType,
      image: this.game.images[obstacleType],
      xPosition,
      yPosition,
    };
  }
}

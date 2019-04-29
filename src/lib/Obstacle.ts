import Game from './Game';
import ObstacleModel from '../types/ObstacleType';
import { Direction, ObstacleType } from '../types/Enum';
import { randomBetween, closeEnough } from './Util';

export default class Obstacle {
  public game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public generateRandomObstacles(
    count: number,
    minX = 0,
    maxX = this.game.canvasHelper.width,
    minY = 0,
    maxY = this.game.canvasHelper.height
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
    maxX = this.game.canvasHelper.width,
    minY = 0,
    maxY = this.game.canvasHelper.height
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

  public moveExistingObstacles(speed: number = this.game.hero.speed) {
    this.game.obstacles = this.game.obstacles.map(obstacle => {
      switch (this.game.hero.direction) {
        case Direction.North:
          obstacle.yPosition += speed;
          break;
        case Direction.East:
          obstacle.xPosition -= speed;
          break;
        case Direction.SouthEast:
          obstacle.xPosition -= speed;
          obstacle.yPosition -= speed;
          break;
        case Direction.South:
          obstacle.yPosition -= speed;
          break;
        case Direction.SouthWest:
          obstacle.xPosition += speed;
          obstacle.yPosition -= speed;
          break;
        case Direction.West:
          obstacle.xPosition += speed;
          break;
        default:
          break;
      }
      this.game.canvasHelper.draw(obstacle);
      return obstacle;
    });
  }

  public createNewObstacles(direction: Direction) {
    let minX = 0 - Game.gameBoardPadding;
    let maxX = this.game.canvasHelper.width + Game.gameBoardPadding;
    let minY = this.game.canvasHelper.height;
    let maxY = this.game.canvasHelper.height + Game.gameBoardPadding;

    if (direction === Direction.West) {
      minX = 0 - Game.gameBoardPadding;
      maxX = 0;
      minY = 0;
      maxY = this.game.canvasHelper.height;
    }
    if (direction === Direction.East) {
      minX = this.game.canvasHelper.width;
      maxX = this.game.canvasHelper.width + Game.gameBoardPadding;
      minY = 0;
      maxY = this.game.canvasHelper.height;
    }

    let newObstacles: ObstacleModel[] = [];
    if (
      randomBetween(0, Game.chanceOfNewObstacle) === Game.chanceOfNewObstacle
    ) {
      newObstacles = this.generateRandomObstacles(1, minX, maxX, minY, maxY);
    }

    this.game.obstacles = this.game.obstacles.concat(newObstacles);
  }

  public removeOldObstacles() {
    this.game.obstacles = this.game.obstacles.filter(
      obstacle => obstacle.yPosition >= 0 - Number(obstacle.image.height) - 500
    );
  }
}

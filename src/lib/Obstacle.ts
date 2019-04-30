import config from '../gameConfig';
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
  ): ObstacleModel[] {
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

  private getRandomObstacleType(): ObstacleType {
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

  public moveExistingObstacles(speed: number = this.game.hero.speed): void {
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
      return obstacle;
    });
  }

  public drawObstacles(): void {
    this.game.obstacles.forEach(obstacle => {
      this.game.canvasHelper.draw(obstacle);
    });
  }

  public createNewObstacle(direction: Direction): void {
    let minX = 0 - config.gameBoardPadding;
    let maxX = this.game.canvasHelper.width + config.gameBoardPadding;
    let minY = this.game.canvasHelper.height;
    let maxY = this.game.canvasHelper.height + config.gameBoardPadding;

    if (direction === Direction.West) {
      minX = 0 - config.gameBoardPadding;
      maxX = 0;
      minY = 0;
      maxY = this.game.canvasHelper.height;
    }
    if (direction === Direction.East) {
      minX = this.game.canvasHelper.width;
      maxX = this.game.canvasHelper.width + config.gameBoardPadding;
      minY = 0;
      maxY = this.game.canvasHelper.height;
    }

    let newObstacles: ObstacleModel[] = [];
    if (
      randomBetween(0, config.chanceOfNewObstacle) ===
      config.chanceOfNewObstacle
    ) {
      newObstacles = this.generateRandomObstacles(1, minX, maxX, minY, maxY);
    }

    this.game.obstacles = this.game.obstacles.concat(newObstacles);
  }

  public removeOldObstacles(): void {
    this.game.obstacles = this.game.obstacles.filter(
      obstacle => obstacle.yPosition >= 0 - Number(obstacle.image.height) - 500
    );
  }
}

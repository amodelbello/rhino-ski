import { fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';

import CanvasHelper from './Canvas';
import {
  Direction,
  ObstacleType,
  GameStatus,
  ValidControl,
  JumpStage,
} from '../types/Enum';
import { randomBetween, closeEnough } from './Util';
import Character from '../types/CharacterType';
import Obstacle from '../types/ObstacleType';
import Controls from './Controls';
import Actions from './Actions';

export default class Game {
  private canvas: CanvasHelper;
  private keyboard$ = fromEvent(document, 'keydown').pipe(pluck('keyCode'));
  private controls: Controls;
  private actions: Actions;
  private currentJumpingFrame = 0;

  public images: Record<string, any>;
  public obstacles: Obstacle[];
  public gameStatus: GameStatus = 0;
  public hero: Character;

  // TODO: Make all of these configurable
  public static intialNumberOfObstacles = 50;
  public static gameBoardPadding = 100;
  public static chanceOfNewObstacle = 5; // the lower the number the more likely the chance
  public static defaultSpeed = 3;
  public static jumpingFramesTotalCount = 50;

  public constructor(canvas: CanvasHelper, images: Record<string, any>) {
    this.canvas = canvas;
    this.images = images;
    this.hero = this.initHero();
    this.obstacles = this.generateRandomObstacles(Game.intialNumberOfObstacles);
    this.controls = new Controls();
    this.actions = new Actions(this);
  }

  private initHero(): Character {
    const image = this.images.skierRight;
    return {
      image,
      xPosition: this.canvas.width / 2 - image.width / 2,
      yPosition: this.canvas.height / 2 - image.height / 2,
      direction: Direction.East,
      speed: Game.defaultSpeed,
      isMoving: false,
      isJumping: false,
    };
  }

  private generateRandomObstacles(
    count: number,
    minX = 0,
    maxX = this.canvas.width,
    minY = 0,
    maxY = this.canvas.height
  ) {
    const obstacles: Obstacle[] = [];
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
    maxX = this.canvas.width,
    minY = 0,
    maxY = this.canvas.height
  ): number[] {
    const xPosition = randomBetween(minX, maxX);
    const yPosition = randomBetween(minY, maxY);

    if (
      closeEnough(xPosition, this.hero.xPosition, 50) &&
      closeEnough(yPosition, this.hero.yPosition, 50)
    ) {
      return this.getRandomObstaclePosition(minX, maxX, minY, maxY);
    }
    return [xPosition, yPosition];
  }

  private initObstacle(
    obstacleType: ObstacleType,
    xPosition: number,
    yPosition: number
  ): Obstacle {
    return {
      type: obstacleType,
      image: this.images[obstacleType],
      xPosition,
      yPosition,
    };
  }

  public start() {
    // Subscribe to keyboard observable
    this.keyboard$.subscribe(code => {
      if (this.controls.controlIsValid(Number(code))) {
        this.controls.setCurrentControl(Number(code));
        this.fireActionFromControl(this.controls.currentControl);
        // console.log(this.hero);
      }
    });

    // Initialize hero and obstacles
    this.canvas.draw(this.hero);
    this.obstacles.forEach(obstacle => {
      this.canvas.draw(obstacle);
    });

    // Set initial game status
    this.gameStatus = GameStatus.Stopped;

    // Run the game
    this.gameLoop();
  }

  private gameLoop = () => {
    this.nextFrame();
    requestAnimationFrame(this.gameLoop);
  };

  private fireActionFromControl(control: ValidControl) {
    switch (control) {
      case ValidControl.Up:
      case ValidControl.W:
        this.actions.moveUp();
        break;
      case ValidControl.Right:
      case ValidControl.D:
        this.actions.moveRight();
        break;
      case ValidControl.Down:
      case ValidControl.S:
        this.actions.moveDown();
        break;
      case ValidControl.Left:
      case ValidControl.A:
        this.actions.moveLeft();
        break;
      case ValidControl.P:
      case ValidControl.Space:
        this.actions.pause();
        break;
      default:
        break;
    }
  }

  public nextFrame() {
    if (this.hero.isMoving) {
      this.canvas.clear();

      if (this.hero.isJumping) {
        this.doJump();
      } else {
        this.checkForCollision();
      }

      this.moveExistingObstacles();
      this.createNewObstacles(this.hero.direction);
      this.removeOldObstacles();

      this.canvas.draw(this.hero);
    }
  }

  private doJump() {
    if (this.currentJumpingFrame >= Game.jumpingFramesTotalCount) {
      this.hero.isJumping = false;
      this.hero.image = this.getHeroImageByDirection();
    } else {
      this.currentJumpingFrame++;
      this.hero.image = this.images[this.determineJumpingStage()];
    }
  }

  // TODO: This could be a lot smarter
  private determineJumpingStage() {
    if (this.currentJumpingFrame < 11) {
      return JumpStage.One;
    } else if (this.currentJumpingFrame > 10 && this.currentJumpingFrame < 21) {
      return JumpStage.Two;
    } else if (this.currentJumpingFrame > 20 && this.currentJumpingFrame < 31) {
      return JumpStage.Three;
    } else if (this.currentJumpingFrame > 30 && this.currentJumpingFrame < 41) {
      return JumpStage.Four;
    } else {
      return JumpStage.Five;
    }
  }

  private getHeroImageByDirection() {
    switch (this.hero.direction) {
      case Direction.Crash:
        return this.images.skierCrash;
      case Direction.North:
        return this.images.skierRight;
      case Direction.West:
        return this.images.skierLeft;
      case Direction.SouthWest:
        return this.images.skierLeftDown;
      case Direction.South:
        return this.images.skierDown;
      case Direction.SouthEast:
        return this.images.skierRightDown;
      case Direction.East:
        return this.images.skierRight;
      default:
        return this.images.skierRight;
    }
  }

  private checkForCollision() {
    this.obstacles.forEach(obstacle => {
      if (
        closeEnough(obstacle.xPosition, this.hero.xPosition) &&
        closeEnough(obstacle.yPosition, this.hero.yPosition)
      ) {
        if (obstacle.type === ObstacleType.Ramp) {
          if (
            this.hero.direction === Direction.SouthWest ||
            this.hero.direction === Direction.South ||
            this.hero.direction === Direction.SouthEast
          ) {
            this.hero.isJumping = true;
            this.currentJumpingFrame = 0;
          }
        } else {
          this.hero.isMoving = false;
          this.hero.direction = Direction.Crash;
          this.hero.image = this.images.skierCrash;
        }
      }
    });
  }

  public moveExistingObstacles(speed: number = this.hero.speed) {
    this.obstacles = this.obstacles.map(obstacle => {
      switch (this.hero.direction) {
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
      this.canvas.draw(obstacle);
      return obstacle;
    });
  }

  private createNewObstacles(direction: Direction) {
    let minX = 0 - Game.gameBoardPadding;
    let maxX = this.canvas.width + Game.gameBoardPadding;
    let minY = this.canvas.height;
    let maxY = this.canvas.height + Game.gameBoardPadding;

    if (direction === Direction.West) {
      minX = 0 - Game.gameBoardPadding;
      maxX = 0;
      minY = 0;
      maxY = this.canvas.height;
    }
    if (direction === Direction.East) {
      minX = this.canvas.width;
      maxX = this.canvas.width + Game.gameBoardPadding;
      minY = 0;
      maxY = this.canvas.height;
    }

    let newObstacles: Obstacle[] = [];
    if (
      randomBetween(0, Game.chanceOfNewObstacle) === Game.chanceOfNewObstacle
    ) {
      newObstacles = this.generateRandomObstacles(1, minX, maxX, minY, maxY);
    }

    this.obstacles = this.obstacles.concat(newObstacles);
  }

  private removeOldObstacles() {
    this.obstacles = this.obstacles.filter(
      obstacle => obstacle.yPosition >= 0 - Number(obstacle.image.height) - 500
    );
  }
}

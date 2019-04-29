import { fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';

import CanvasHelper from './Canvas';
import {
  Direction,
  ObstacleType,
  GameStatus,
  ValidControl,
} from '../types/Enum';
import { randomBetween, closeEnough } from './Util';
import Character from '../types/CharacterType';
import Obstacle from '../types/ObstacleType';
import Controls from './Controls';
import Actions from './Actions';
import HeroHelper from './Hero';
import ObstacleHelper from './Obstacle';

export default class Game {
  private keyboard$ = fromEvent(document, 'keydown').pipe(pluck('keyCode'));
  private controls: Controls;
  private actions: Actions;
  private setIsPaused: Function;
  private heroHelper: HeroHelper;
  private obstacleHelper: ObstacleHelper;

  public canvas: CanvasHelper;
  public images: Record<string, any>;
  public obstacles: Obstacle[];
  public gameStatus: GameStatus = 0;
  public hero: Character;
  public currentJumpingFrame: number;
  public isPaused: boolean;

  // TODO: Make all of these configurable
  public static intialNumberOfObstacles = 50;
  public static gameBoardPadding = 100;
  public static chanceOfNewObstacle = 5; // the lower the number the more likely the chance
  public static defaultSpeed = 3;
  public static jumpingFramesTotalCount = 50;

  public constructor(
    canvas: CanvasHelper,
    images: Record<string, any>,
    stateActions: any
  ) {
    this.canvas = canvas;
    this.images = images;
    this.heroHelper = new HeroHelper(this);
    this.obstacleHelper = new ObstacleHelper(this);
    this.hero = this.heroHelper.initHero();
    this.obstacles = this.obstacleHelper.generateRandomObstacles(
      Game.intialNumberOfObstacles
    );
    this.controls = new Controls();
    this.actions = new Actions(this);
    this.currentJumpingFrame = 0;

    // TODO: isPaused should probably be passed into this class, not set like this
    this.isPaused = false;
    this.setIsPaused = stateActions.setIsPaused;
  }

  public start() {
    // Subscribe to keyboard observable
    this.keyboard$.subscribe(code => {
      if (this.controls.controlIsValid(Number(code))) {
        this.controls.setCurrentControl(Number(code));
        this.fireActionFromControl(this.controls.currentControl);
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

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
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
        this.setIsPaused(!this.isPaused);
        break;
      case ValidControl.Space:
        break;
      default:
        break;
    }
  }

  public nextFrame() {
    if (this.hero.isMoving && !this.isPaused) {
      this.canvas.clear();

      if (this.hero.isJumping) {
        this.heroHelper.doJump();
      } else {
        this.checkForCollision();
      }

      this.moveExistingObstacles();
      this.createNewObstacles(this.hero.direction);
      this.removeOldObstacles();

      this.canvas.draw(this.hero);
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
      newObstacles = this.obstacleHelper.generateRandomObstacles(
        1,
        minX,
        maxX,
        minY,
        maxY
      );
    }

    this.obstacles = this.obstacles.concat(newObstacles);
  }

  private removeOldObstacles() {
    this.obstacles = this.obstacles.filter(
      obstacle => obstacle.yPosition >= 0 - Number(obstacle.image.height) - 500
    );
  }
}

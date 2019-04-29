import { fromEvent, merge } from 'rxjs';

import config from '../gameConfig';
import CanvasHelper from './Canvas';
import { Direction, ObstacleType, GameStatus } from '../types/Enum';
import { closeEnough } from './Util';
import Character from '../types/CharacterType';
import Obstacle from '../types/ObstacleType';
import Controls from './Controls';
import Actions from './Actions';
import HeroHelper from './Hero';
import ObstacleHelper from './Obstacle';

export default class Game {
  private keyboard$ = merge(
    fromEvent(document, 'keydown'),
    fromEvent(document, 'keyup')
  );
  private controls: Controls;

  public heroHelper: HeroHelper;
  public actionsHelper: Actions;
  public canvasHelper: CanvasHelper;
  public obstacleHelper: ObstacleHelper;
  public images: Record<string, any>;
  public obstacles: Obstacle[];
  public gameStatus: GameStatus = 0;
  public hero: Character;
  public currentJumpingFrame: number;
  public isPaused: boolean;
  public setIsPaused: Function;

  public constructor(
    canvas: CanvasHelper,
    images: Record<string, any>,
    stateActions: any
  ) {
    this.canvasHelper = canvas;
    this.images = images;
    this.heroHelper = new HeroHelper(this);
    this.obstacleHelper = new ObstacleHelper(this);
    this.hero = this.heroHelper.initHero();
    this.obstacles = this.obstacleHelper.generateRandomObstacles(
      config.intialNumberOfObstacles
    );
    this.controls = new Controls(this);
    this.actionsHelper = new Actions(this);
    this.currentJumpingFrame = 0;

    // TODO: isPaused should probably be passed into this class, not set like this
    this.isPaused = false;
    this.setIsPaused = stateActions.setIsPaused;
  }

  public start(): void {
    // Subscribe to keyboard observable
    this.keyboard$.subscribe((event: Event) => {
      if (event instanceof KeyboardEvent) {
        const { keyCode, type } = event;
        if (this.controls.controlIsValid(Number(keyCode))) {
          const controlMethod = this.controls.getControlMethodFromEventType(
            type
          );
          this.controls.setCurrentControl(Number(keyCode));
          this.controls.fireActionFromControl(
            this.controls.currentControl,
            controlMethod
          );
        }
      }
    });

    // Initialize hero and obstacles
    this.canvasHelper.draw(this.hero);
    this.obstacles.forEach(obstacle => {
      this.canvasHelper.draw(obstacle);
    });

    // Set initial game status
    this.gameStatus = GameStatus.Stopped;

    // Run the game
    this.gameLoop();
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  private gameLoop = (): void => {
    this.nextFrame();
    requestAnimationFrame(this.gameLoop);
  };

  public nextFrame(): void {
    if (this.hero.isMoving && !this.isPaused) {
      this.canvasHelper.clear();

      if (this.hero.isJumping) {
        this.heroHelper.doJump();
      } else {
        this.checkForCollision();
      }

      this.obstacleHelper.moveExistingObstacles();
      this.obstacleHelper.createNewObstacles(this.hero.direction);
      this.obstacleHelper.removeOldObstacles();

      this.canvasHelper.draw(this.hero);
    }
  }

  private checkForCollision(): void {
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
}

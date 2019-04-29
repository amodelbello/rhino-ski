import { fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';

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
  private keyboard$ = fromEvent(document, 'keydown').pipe(pluck('keyCode'));
  private controls: Controls;
  private heroHelper: HeroHelper;

  public actions: Actions;
  public canvas: CanvasHelper;
  public obstacleHelper: ObstacleHelper;
  public images: Record<string, any>;
  public obstacles: Obstacle[];
  public gameStatus: GameStatus = 0;
  public hero: Character;
  public currentJumpingFrame: number;
  public isPaused: boolean;
  public setIsPaused: Function;

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
    this.controls = new Controls(this);
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
        this.controls.fireActionFromControl(this.controls.currentControl);
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

  public nextFrame() {
    if (this.hero.isMoving && !this.isPaused) {
      this.canvas.clear();

      if (this.hero.isJumping) {
        this.heroHelper.doJump();
      } else {
        this.checkForCollision();
      }

      this.obstacleHelper.moveExistingObstacles();
      this.obstacleHelper.createNewObstacles(this.hero.direction);
      this.obstacleHelper.removeOldObstacles();

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
}

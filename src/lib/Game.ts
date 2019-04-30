import { fromEvent, merge, Subscription } from 'rxjs';

import config from '../gameConfig';
import CanvasHelper from './Canvas';
import { Direction, ObstacleType, GameStatus } from '../types/Enum';
import { closeEnough } from './Util';
import { Character } from '../types/Type';
import { Obstacle } from '../types/Type';
import Controls from './Controls';
import Actions from './Actions';
import HeroHelper from './Hero';
import VillainHelper from './Villain';
import ObstacleHelper from './Obstacle';
import Timer from './Timer';

export default class Game {
  private keyboard$ = merge(
    fromEvent(document, 'keydown'),
    fromEvent(document, 'keyup')
  );
  private keyboardSubscription: Subscription = Subscription.EMPTY;
  private controls: Controls;
  private score: number;
  private infoModalIsDisplayed: boolean;

  public heroHelper: HeroHelper;
  public hero: Character;
  public villainHelper: VillainHelper;
  public villain: Character;
  public actionsHelper: Actions;
  public obstacleHelper: ObstacleHelper;
  public obstacles: Obstacle[];
  public canvasHelper: CanvasHelper;
  public images: Record<string, any>;
  public timer: Timer;
  public gameStatus: GameStatus;
  public setGameStatus: Function;
  public currentJumpingFrame: number;
  public currentEatingFrame: number;
  public isPaused: boolean;
  public setIsPaused: Function;
  public setScore: Function;
  public setHiScore: Function;
  public setTimeRemaining: Function;

  public constructor(
    canvas: CanvasHelper,
    images: Record<string, any>,
    stateActions: any
  ) {
    this.canvasHelper = canvas;
    this.images = images;
    this.heroHelper = new HeroHelper(this);
    this.hero = this.heroHelper.initHero();
    this.villainHelper = new VillainHelper(this);
    this.villain = this.villainHelper.initVillain();
    this.obstacleHelper = new ObstacleHelper(this);
    this.obstacles = this.obstacleHelper.generateRandomObstacles(
      config.intialNumberOfObstacles
    );
    this.timer = new Timer(this, config.timeLimit);
    // TODO: rename
    this.controls = new Controls(this);
    this.actionsHelper = new Actions(this);
    this.currentJumpingFrame = 0;
    this.currentEatingFrame = 0;

    this.isPaused = false;
    this.setIsPaused = stateActions.setIsPaused;
    this.score = 0;
    this.setScore = stateActions.setScore;
    this.setHiScore = stateActions.setHiScore;
    this.setTimeRemaining = stateActions.setTimeRemaining;
    this.infoModalIsDisplayed = stateActions.infoModalIsDisplayed;
    this.gameStatus = stateActions.gameStatus;
    this.setGameStatus = stateActions.setGameStatus;
  }

  public start(): void {
    // Subscribe to keyboard observable
    this.keyboardSubscription = this.keyboard$.subscribe((event: Event) => {
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

    // Draw hero, villain, and obstacles
    this.canvasHelper.draw(this.hero);
    this.obstacles.forEach(obstacle => {
      this.canvasHelper.draw(obstacle);
    });
    this.canvasHelper.draw(this.villain);

    // Set initial game status
    this.setGameStatus(GameStatus.Unstarted);

    // Run the game
    this.gameLoop();
  }

  public pause(): void {
    this.isPaused = true;
    this.timer.stop();
  }

  public resume(): void {
    this.isPaused = false;
    if (this.gameStatus !== GameStatus.Unstarted) {
      this.timer.start(() => {
        this.villain.isMoving = true;
      });
    }
  }

  public restart(): void {
    this.hero = this.heroHelper.initHero();
    this.villain = this.villainHelper.initVillain();
    this.obstacles = this.obstacleHelper.generateRandomObstacles(
      config.intialNumberOfObstacles
    );
    this.timer = new Timer(this, config.timeLimit);
    this.setTimeRemaining(config.timeLimit);
    this.currentJumpingFrame = 0;
    this.currentEatingFrame = 0;
    this.isPaused = false;
    this.score = 0;
    this.setGameStatus(GameStatus.Unstarted);
    this.gameStatus = GameStatus.Unstarted;
    this.start();
  }

  public canPause(): boolean {
    if (
      this.gameStatus !== GameStatus.Unstarted &&
      this.gameStatus !== GameStatus.Dead &&
      this.gameStatus !== GameStatus.Over &&
      !this.infoModalIsDisplayed
    ) {
      return true;
    }
    return false;
  }

  private gameLoop = (): void => {
    if (this.gameStatus !== GameStatus.Over) {
      this.nextFrame();
      requestAnimationFrame(this.gameLoop);
    } else {
      this.keyboardSubscription.unsubscribe();
    }
  };

  public nextFrame(): void {
    if (!this.isPaused) {
      this.canvasHelper.clear();

      if (this.villain.isMoving) {
        this.villainHelper.walk();
        if (this.heroIsCaught()) {
          this.setGameStatus(GameStatus.Dead);
          this.villain.isMoving = false;
          this.hero.isMoving = false;
          this.villain.isEating = true;
        }
      }

      if (this.villain.isEating) {
        this.villainHelper.eat();
      }

      if (this.hero.isMoving) {
        this.obstacleHelper.moveExistingObstacles();
        if (this.hero.isJumping) {
          this.heroHelper.jump();
        } else {
          this.checkForCollision();
        }
        this.obstacleHelper.createNewObstacle(this.hero.direction);
        this.obstacleHelper.removeOldObstacles();
      }

      this.obstacleHelper.drawObstacles();

      this.canvasHelper.draw(this.villain);

      if (!this.heroIsCaught()) {
        this.canvasHelper.draw(this.hero);
      }
    }
  }

  private heroIsCaught() {
    return closeEnough(this.hero.xPosition, this.villain.xPosition, 5);
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
            this.scoreRamp();
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

  private scoreRamp(): void {
    this.score += config.rampScoreValue;
    this.setScore(this.score);

    const hiScore = Number(localStorage.getItem(config.hiScoreFieldName));
    if (!hiScore || hiScore < this.score) {
      localStorage.setItem(config.hiScoreFieldName, this.score.toString());
      this.setHiScore(this.score);
    }
  }
}

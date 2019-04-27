import { fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';

import CanvasHelper from './Canvas';
import {
  Direction,
  ObstacleType,
  GameStatus,
  ValidControl,
} from '../types/Enum';
import { randomBetween } from './Util';
import Character from '../types/CharacterType';
import Item from '../types/ItemType';
import Controls from './Controls';
import Actions from './Actions';

export default class Game {
  private canvas: CanvasHelper;
  private keyboard$ = fromEvent(document, 'keydown').pipe(pluck('keyCode'));
  private controls: Controls;
  private actions: Actions;

  public images: Record<string, any>;
  public obstacles: Item[];
  public gameStatus: GameStatus = 0;
  public hero: Character;

  public static intialNumberOfObstacles = 12;
  public static gameBoardPadding = 100;
  public static chanceOfNewObstacle = 20; // the lower the number the more likely the chance
  public static defaultSpeed = 3;

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
    };
  }

  private generateRandomObstacles(
    count: number,
    minX = 0,
    maxX = this.canvas.width,
    minY = 0,
    maxY = this.canvas.height
  ) {
    const obstacles: Item[] = [];
    for (let x = 0; x < count; x++) {
      const obstacleType = this.getRandomObstacleType();
      const xPosition = randomBetween(minX, maxX);
      const yPosition = randomBetween(minY, maxY);

      const obstacle = this.initObstacle(obstacleType, xPosition, yPosition);
      obstacles.push(obstacle);
    }

    return obstacles;
  }

  private getRandomObstacleType() {
    const randomNumber = randomBetween(0, 3);
    const obstacleTypes: ObstacleType[] = [
      ObstacleType.Rock1,
      ObstacleType.Rock2,
      ObstacleType.Tree,
      ObstacleType.TreeCluster,
    ];

    return obstacleTypes[randomNumber];
  }

  private initObstacle(
    obstacleType: ObstacleType,
    xPosition: number,
    yPosition: number
  ): Item {
    return {
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
        console.log(this.hero);
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
      this.canvas.draw(this.hero);

      this.moveExistingObstacles();
      this.createNewObstacles();
      this.removeOldObstacles();
    }
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
      }
      this.canvas.draw(obstacle);
      return obstacle;
    });
  }

  private createNewObstacles() {
    const minX = 0 - Game.gameBoardPadding;
    const maxX = this.canvas.width + Game.gameBoardPadding;
    const minY = this.canvas.height;
    const maxY = this.canvas.height + Game.gameBoardPadding;
    let newObstacles: Item[] = [];
    if (
      randomBetween(0, Game.chanceOfNewObstacle) === Game.chanceOfNewObstacle
    ) {
      newObstacles = this.generateRandomObstacles(1, minX, maxX, minY, maxY);
    }

    this.obstacles = this.obstacles.concat(newObstacles);
  }

  private removeOldObstacles() {
    this.obstacles = this.obstacles.filter(
      obstacle => obstacle.yPosition >= 0 - Number(obstacle.image.height) - 5000
    );
  }
}

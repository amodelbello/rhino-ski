import { fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';

import CanvasHelper from './Canvas';
import { Direction, Obstacle } from '../types/Enum';
import { randomBetween } from './Util';
import Character from '../types/CharacterType';
import Item from '../types/ItemType';

export default class Game {
  private canvas: CanvasHelper;
  private images: Record<string, any>;
  private hero: Character;
  private obstacles: Item[];
  private keyboard$ = fromEvent(document, 'keydown').pipe(pluck('keyCode'));

  public static intialNumberOfObstacles = 12;

  public constructor(canvas: CanvasHelper, images: Record<string, any>) {
    this.canvas = canvas;
    this.images = images;
    this.hero = this.initHero();
    this.obstacles = this.generateRandomObstacles();
  }

  private initHero(): Character {
    const image = this.images.skierRight;
    return {
      image,
      xPosition: this.canvas.width / 2 - image.width / 2,
      yPosition: this.canvas.height / 2 - image.height / 2,
      direction: Direction.East,
      isMoving: false,
    };
  }

  private generateRandomObstacles() {
    const obstacles: Item[] = [];
    for (let x = 0; x < Game.intialNumberOfObstacles; x++) {
      const obstacleType = this.getRandomObstacleType();
      const xPosition = randomBetween(0, this.canvas.width);
      const yPosition = randomBetween(0, this.canvas.height);

      const obstacle = this.initObstacle(obstacleType, xPosition, yPosition);
      obstacles.push(obstacle);
    }

    return obstacles;
  }

  private getRandomObstacleType() {
    const randomNumber = randomBetween(0, 3);
    const obstacleTypes: Obstacle[] = [
      Obstacle.Rock1,
      Obstacle.Rock2,
      Obstacle.Tree,
      Obstacle.TreeCluster,
    ];

    return obstacleTypes[randomNumber];
  }

  private initObstacle(
    obstacleType: Obstacle,
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
    this.keyboard$.subscribe(val => {
      console.log('val', val);
    });
    this.canvas.draw(this.hero);
    this.obstacles.forEach(obstacle => {
      this.canvas.draw(obstacle);
    });
    this.gameLoop();
  }

  private gameLoop = () => {
    // console.log('frame', ++this.aNumber);
    requestAnimationFrame(this.gameLoop);
  };
}

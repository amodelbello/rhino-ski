import Game from './Game';
import { GameStatus, Direction, GameAction } from '../types/Enum';

export default class Actions {
  private game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public moveUp() {
    if (this.heroCanMove()) {
      this.updateHero(GameAction.MoveUp);
    }
  }

  public moveLeft() {
    if (this.heroCanMove()) {
      this.updateHero(GameAction.MoveLeft);
    }
  }

  public moveRight() {
    if (this.heroCanMove()) {
      this.updateHero(GameAction.MoveRight);
    }
  }

  public moveDown() {
    if (this.heroCanMove()) {
      this.game.hero.isMoving = true;
      this.updateHero(GameAction.MoveDown);
    }
  }

  private heroCanMove(): boolean {
    if (
      this.game.gameStatus !== GameStatus.Dying &&
      this.game.gameStatus !== GameStatus.Dead &&
      this.game.gameStatus !== GameStatus.Paused
    ) {
      return true;
    }
    return false;
  }

  private heroCanChangeDirection(): boolean {
    if (!this.game.hero.isJumping) {
      return true;
    }
    return false;
  }

  private updateHero(action: GameAction) {
    if (!this.heroCanChangeDirection() || this.game.isPaused) return;

    // TODO: Yowsers! this is hard to read. Can this be improved?
    switch (action) {
      case GameAction.MoveUp:
        if (!this.game.hero.isMoving) {
          this.hike(Direction.North);
        }
        switch (this.game.hero.direction) {
          case Direction.Crash:
          case Direction.East:
            this.game.hero.direction = Direction.East;
            this.game.hero.image = this.game.images.skierRight;
            this.game.hero.isMoving = false;
            break;
          case Direction.SouthEast:
            this.game.hero.direction = Direction.East;
            this.game.hero.image = this.game.images.skierRight;
            break;
          case Direction.West:
            this.game.hero.direction = Direction.West;
            this.game.hero.image = this.game.images.skierLeft;
            this.game.hero.isMoving = false;
            break;
          case Direction.SouthWest:
            this.game.hero.direction = Direction.West;
            this.game.hero.image = this.game.images.skierLeft;
            break;
          case Direction.South:
            break;
          default:
            break;
        }
        break;

      case GameAction.MoveLeft:
        switch (this.game.hero.direction) {
          case Direction.Crash:
            this.game.hero.direction = Direction.West;
            this.game.hero.image = this.game.images.skierLeft;
            this.hike(Direction.West);
            break;
          case Direction.West:
            this.game.hero.direction = Direction.West;
            this.game.hero.image = this.game.images.skierLeft;
            this.hike(Direction.West);
            break;
          case Direction.SouthWest:
            this.game.hero.direction = Direction.West;
            this.game.hero.image = this.game.images.skierLeft;
            break;
          case Direction.South:
            this.game.hero.direction = Direction.SouthWest;
            this.game.hero.image = this.game.images.skierLeftDown;
            break;
          case Direction.SouthEast:
            this.game.hero.direction = Direction.South;
            this.game.hero.image = this.game.images.skierDown;
            break;
          case Direction.East:
            this.game.hero.direction = Direction.SouthEast;
            this.game.hero.image = this.game.images.skierRightDown;
            break;
          default:
            break;
        }
        break;

      case GameAction.MoveRight:
        switch (this.game.hero.direction) {
          case Direction.Crash:
            this.game.hero.direction = Direction.East;
            this.game.hero.image = this.game.images.skierRight;
            this.hike(Direction.East);
            break;
          case Direction.East:
            this.game.hero.direction = Direction.East;
            this.game.hero.image = this.game.images.skierRight;
            this.hike(Direction.East);
            break;
          case Direction.SouthEast:
            this.game.hero.direction = Direction.East;
            this.game.hero.image = this.game.images.skierRight;
            break;
          case Direction.South:
            this.game.hero.direction = Direction.SouthEast;
            this.game.hero.image = this.game.images.skierRightDown;
            break;
          case Direction.SouthWest:
            this.game.hero.direction = Direction.South;
            this.game.hero.image = this.game.images.skierDown;
            break;
          case Direction.West:
            this.game.hero.direction = Direction.SouthWest;
            this.game.hero.image = this.game.images.skierLeftDown;
            break;
          default:
            break;
        }
        break;

      case GameAction.MoveDown:
        switch (this.game.hero.direction) {
          case Direction.Crash:
            this.game.hero.direction = Direction.South;
            this.game.hero.image = this.game.images.skierDown;
            this.hike(Direction.South);
            break;
          case Direction.South:
          case Direction.SouthEast:
          case Direction.SouthWest:
            this.game.hero.direction = Direction.South;
            this.game.hero.image = this.game.images.skierDown;
            break;
          case Direction.West:
            this.game.hero.direction = Direction.SouthWest;
            this.game.hero.image = this.game.images.skierLeftDown;
            break;
          case Direction.East:
            this.game.hero.direction = Direction.SouthEast;
            this.game.hero.image = this.game.images.skierRightDown;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  private hike(direction: Direction) {
    const currentDirection = this.game.hero.direction;
    this.game.hero.isMoving = true;
    this.game.hero.direction = direction;
    this.game.moveExistingObstacles(2);
    this.game.nextFrame();
    this.game.hero.direction = currentDirection;
    this.game.hero.isMoving = false;
  }
}

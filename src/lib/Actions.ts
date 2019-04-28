import Game from './Game';
import { GameStatus, Direction, GameAction } from '../types/Enum';

export default class Actions {
  private game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public moveUp() {
    if (this.heroCanMove()) {
      this.updateHeroDirection(GameAction.MoveUp);
      // Need to manually call this because
      // hero will be stopped before next time through the loop
      this.game.nextFrame();
      this.game.hero.isMoving = false;
    }
  }

  public moveLeft() {
    if (this.heroCanMove()) {
      this.game.hero.isMoving = true;
      this.updateHeroDirection(GameAction.MoveLeft);
    }
  }

  public moveDown() {
    if (this.heroCanMove()) {
      this.game.hero.isMoving = true;
      this.updateHeroDirection(GameAction.MoveDown);
    }
  }

  public moveRight() {
    if (this.heroCanMove()) {
      this.game.hero.isMoving = true;
      this.updateHeroDirection(GameAction.MoveRight);
    }
  }

  public pause() {}

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

  private updateHeroDirection(action: GameAction) {
    // TODO: Yowsers! this is hard to read. Maybe go back to the original way
    switch (action) {
      case GameAction.MoveUp:
        if (!this.game.hero.isMoving) {
          this.hike();
        }
        if (
          this.game.hero.direction === Direction.Crash ||
          this.game.hero.direction === Direction.East ||
          this.game.hero.direction === Direction.SouthEast
        ) {
          this.game.hero.direction = Direction.East;
          this.game.hero.image = this.game.images.skierRight;
        } else if (
          this.game.hero.direction === Direction.West ||
          this.game.hero.direction === Direction.SouthWest
        ) {
          this.game.hero.direction = Direction.West;
          this.game.hero.image = this.game.images.skierLeft;
        } else if (this.game.hero.direction === Direction.South) {
          this.game.hero.direction = Direction.SouthWest;
          this.game.hero.image = this.game.images.skierRight;
        }
        break;
      case GameAction.MoveLeft:
        if (
          this.game.hero.direction === Direction.Crash ||
          this.game.hero.direction === Direction.West ||
          this.game.hero.direction === Direction.SouthWest
        ) {
          this.game.hero.direction = Direction.West;
          this.game.hero.image = this.game.images.skierLeft;
        } else if (this.game.hero.direction === Direction.South) {
          this.game.hero.direction = Direction.SouthWest;
          this.game.hero.image = this.game.images.skierLeftDown;
        } else if (this.game.hero.direction === Direction.SouthEast) {
          this.game.hero.direction = Direction.South;
          this.game.hero.image = this.game.images.skierDown;
        } else if (this.game.hero.direction === Direction.East) {
          this.game.hero.direction = Direction.SouthEast;
          this.game.hero.image = this.game.images.skierRightDown;
        }
        break;
      case GameAction.MoveDown:
        if (
          this.game.hero.direction === Direction.Crash ||
          this.game.hero.direction === Direction.SouthEast ||
          this.game.hero.direction === Direction.SouthWest ||
          this.game.hero.direction === Direction.South
        ) {
          this.game.hero.direction = Direction.South;
          this.game.hero.image = this.game.images.skierDown;
        } else if (this.game.hero.direction === Direction.West) {
          this.game.hero.direction = Direction.SouthWest;
          this.game.hero.image = this.game.images.skierLeftDown;
        } else if (this.game.hero.direction === Direction.East) {
          this.game.hero.direction = Direction.SouthEast;
          this.game.hero.image = this.game.images.skierRightDown;
        }
        break;
      case GameAction.MoveRight:
        if (
          this.game.hero.direction === Direction.Crash ||
          this.game.hero.direction === Direction.East ||
          this.game.hero.direction === Direction.SouthEast
        ) {
          this.game.hero.direction = Direction.East;
          this.game.hero.image = this.game.images.skierRight;
        } else if (this.game.hero.direction === Direction.South) {
          this.game.hero.direction = Direction.SouthEast;
          this.game.hero.image = this.game.images.skierRightDown;
        } else if (this.game.hero.direction === Direction.SouthWest) {
          this.game.hero.direction = Direction.South;
          this.game.hero.image = this.game.images.skierDown;
        } else if (this.game.hero.direction === Direction.West) {
          this.game.hero.direction = Direction.SouthWest;
          this.game.hero.image = this.game.images.skierLeftDown;
        }
        break;
      default:
        break;
    }
  }

  private hike() {
    const currentDirection = this.game.hero.direction;
    this.game.hero.isMoving = true;
    this.game.hero.direction = Direction.North;
    this.game.moveExistingObstacles(2);
    this.game.nextFrame();
    this.game.hero.direction = currentDirection;
    this.game.hero.isMoving = false;
  }
}

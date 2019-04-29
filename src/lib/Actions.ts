import config from '../gameConfig';
import Game from './Game';
import { Direction, GameAction, GameStatus } from '../types/Enum';

export default class Actions {
  private game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public moveUp(): void {
    if (this.game.heroHelper.heroCanMove()) {
      this.updateHero(GameAction.MoveUp);
      this.kickOffTimer();
    }
  }

  public moveLeft(): void {
    if (this.game.heroHelper.heroCanMove()) {
      this.updateHero(GameAction.MoveLeft);
      this.kickOffTimer();
    }
  }

  public moveRight(): void {
    if (this.game.heroHelper.heroCanMove()) {
      this.updateHero(GameAction.MoveRight);
      this.kickOffTimer();
    }
  }

  public moveDown(): void {
    if (this.game.heroHelper.heroCanMove()) {
      this.game.hero.isMoving = true;
      this.updateHero(GameAction.MoveDown);
      this.kickOffTimer();
    }
  }

  public speedBoost(): void {
    if (this.game.heroHelper.heroCanMove()) {
      this.updateHero(GameAction.SpeedBoost);
    }
  }

  public normalSpeed(): void {
    if (this.game.heroHelper.heroCanMove()) {
      this.updateHero(GameAction.NormalSpeed);
    }
  }

  private kickOffTimer() {
    if (this.game.gameStatus === GameStatus.Unstarted) {
      this.game.gameStatus = GameStatus.Skiing;
      this.game.timer.start(() => {
        this.game.villain.isMoving = true;
      });
    }
  }

  private hike(direction: Direction): void {
    const currentDirection = this.game.hero.direction;
    this.game.hero.isMoving = true;
    this.game.hero.direction = direction;
    this.game.obstacleHelper.moveExistingObstacles(2);
    this.game.nextFrame();
    this.game.hero.direction = currentDirection;
    this.game.hero.isMoving = false;
  }

  private updateHero(action: GameAction): void {
    if (!this.game.heroHelper.heroCanChangeDirection() || this.game.isPaused)
      return;

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
      case GameAction.SpeedBoost:
        this.game.hero.speed = config.defaultSpeed * 2;
        break;
      case GameAction.NormalSpeed:
        this.game.hero.speed = config.defaultSpeed;
        break;
      default:
        break;
    }
  }
}

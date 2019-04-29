import Game from './Game';
import Character from '../types/CharacterType';
import { Direction, JumpStage } from '../types/Enum';

export default class Hero {
  public game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public initHero(): Character {
    const image = this.game.images.skierRight;
    return {
      image,
      xPosition: this.game.canvas.width / 2 - image.width / 2,
      yPosition: this.game.canvas.height / 2 - image.height / 2,
      direction: Direction.East,
      speed: Game.defaultSpeed,
      isMoving: false,
      isJumping: false,
    };
  }

  public getHeroImageByDirection() {
    switch (this.game.hero.direction) {
      case Direction.Crash:
        return this.game.images.skierCrash;
      case Direction.North:
        return this.game.images.skierRight;
      case Direction.West:
        return this.game.images.skierLeft;
      case Direction.SouthWest:
        return this.game.images.skierLeftDown;
      case Direction.South:
        return this.game.images.skierDown;
      case Direction.SouthEast:
        return this.game.images.skierRightDown;
      case Direction.East:
        return this.game.images.skierRight;
      default:
        return this.game.images.skierRight;
    }
  }

  public doJump() {
    if (this.game.currentJumpingFrame >= Game.jumpingFramesTotalCount) {
      this.game.hero.isJumping = false;
      this.game.hero.image = this.getHeroImageByDirection();
    } else {
      this.game.currentJumpingFrame++;
      this.game.hero.image = this.game.images[this.determineJumpingStage()];
    }
  }

  // TODO: This could be a lot smarter
  public determineJumpingStage() {
    if (this.game.currentJumpingFrame < 11) {
      return JumpStage.One;
    } else if (
      this.game.currentJumpingFrame > 10 &&
      this.game.currentJumpingFrame < 21
    ) {
      return JumpStage.Two;
    } else if (
      this.game.currentJumpingFrame > 20 &&
      this.game.currentJumpingFrame < 31
    ) {
      return JumpStage.Three;
    } else if (
      this.game.currentJumpingFrame > 30 &&
      this.game.currentJumpingFrame < 41
    ) {
      return JumpStage.Four;
    } else {
      return JumpStage.Five;
    }
  }
}

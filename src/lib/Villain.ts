import config from '../gameConfig';
import Game from './Game';
import Character from '../types/CharacterType';
import { Direction, EatStage } from '../types/Enum';

export default class Villain {
  public game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public initVillain(): Character {
    const image = this.game.images.rhinoDefault;
    return {
      image,
      xPosition: this.game.canvasHelper.width + 100,
      yPosition: this.game.canvasHelper.height / 2 - image.height / 2,
      direction: Direction.East,
      speed: config.defaultSpeed,
      isMoving: false,
      isEating: false,
    };
  }

  public toggleWalkingImage(): void {
    if (this.game.villain.image === this.game.images.rhinoRunLeft) {
      this.game.villain.image = this.game.images.rhinoRunLeft2;
    } else {
      this.game.villain.image = this.game.images.rhinoRunLeft;
    }
  }

  public walk() {
    this.game.villain.xPosition -= this.game.villain.speed;
    if (this.game.villain.xPosition % 10 === 0) {
      this.toggleWalkingImage();
    }
  }

  public eat(): void {
    if (this.game.currentEatingFrame >= config.eatingFramesTotalCount) {
      this.game.villain.isEating = false;
      this.game.hero.image = this.game.images.rhinoLiftEat4;
    } else {
      this.game.currentEatingFrame++;
      this.game.villain.image = this.game.images[this.determineEatingStage()];
    }
  }

  // TODO: This could be a lot smarter
  public determineEatingStage(): EatStage {
    if (this.game.currentEatingFrame < 11) {
      return EatStage.One;
    } else if (
      this.game.currentEatingFrame > 10 &&
      this.game.currentEatingFrame < 21
    ) {
      return EatStage.Two;
    } else if (
      this.game.currentEatingFrame > 20 &&
      this.game.currentEatingFrame < 31
    ) {
      return EatStage.Three;
    } else if (
      this.game.currentEatingFrame > 30 &&
      this.game.currentEatingFrame < 41
    ) {
      return EatStage.Four;
    } else if (
      this.game.currentEatingFrame > 40 &&
      this.game.currentEatingFrame < 61
    ) {
      return EatStage.Five;
    } else {
      return EatStage.Six;
    }
  }
}

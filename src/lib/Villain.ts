import config from '../gameConfig';
import Game from './Game';
import Character from '../types/CharacterType';
import { Direction } from '../types/Enum';

export default class Villain {
  public game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public initVillain(): Character {
    const image = this.game.images.rhinoDefault;
    return {
      image,
      xPosition: this.game.canvasHelper.width - 100,
      yPosition: this.game.canvasHelper.height / 2 - image.height / 2,
      direction: Direction.East,
      speed: config.defaultSpeed,
      isMoving: false,
      isEating: false,
    };
  }
}

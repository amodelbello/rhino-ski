import Game from './Game';
import { ValidControl } from '../types/Enum';

export default class Controls {
  public game: Game;
  public currentControl: ValidControl = ValidControl.Null;

  public constructor(game: Game) {
    this.game = game;
  }

  public setCurrentControl(code: number) {
    if (this.controlIsValid(code)) {
      const controlValue = ValidControl[code] as keyof typeof ValidControl;
      this.currentControl = ValidControl[controlValue];
    }
  }

  public controlIsValid(code: number) {
    if (ValidControl[code] !== undefined) {
      return true;
    }
    return false;
  }

  public fireActionFromControl(control: ValidControl) {
    switch (control) {
      case ValidControl.Up:
      case ValidControl.W:
        this.game.actions.moveUp();
        break;
      case ValidControl.Right:
      case ValidControl.D:
        this.game.actions.moveRight();
        break;
      case ValidControl.Down:
      case ValidControl.S:
        this.game.actions.moveDown();
        break;
      case ValidControl.Left:
      case ValidControl.A:
        this.game.actions.moveLeft();
        break;
      case ValidControl.P:
        this.game.setIsPaused(!this.game.isPaused);
        break;
      case ValidControl.Space:
        break;
      default:
        break;
    }
  }
}

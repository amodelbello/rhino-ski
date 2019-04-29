import Game from './Game';
import { ValidControl, ControlMethod } from '../types/Enum';

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

  public getControlMethodFromEventType(type: string): ControlMethod {
    let controlMethod: ControlMethod;
    if (type === ControlMethod.KeyDown.valueOf()) {
      controlMethod = ControlMethod.KeyDown;
    } else if (type === ControlMethod.KeyUp.valueOf()) {
      controlMethod = ControlMethod.KeyUp;
    } else {
      controlMethod = ControlMethod.Null;
    }

    return controlMethod;
  }

  public fireActionFromControl(control: ValidControl, method: ControlMethod) {
    switch (control) {
      case ValidControl.Up:
      case ValidControl.W:
        if (method === ControlMethod.KeyDown) {
          this.game.actionsHelper.moveUp();
        }
        break;
      case ValidControl.Right:
      case ValidControl.D:
        if (method === ControlMethod.KeyDown) {
          this.game.actionsHelper.moveRight();
        }
        break;
      case ValidControl.Down:
      case ValidControl.S:
        if (method === ControlMethod.KeyDown) {
          this.game.actionsHelper.moveDown();
        }
        break;
      case ValidControl.Left:
      case ValidControl.A:
        if (method === ControlMethod.KeyDown) {
          this.game.actionsHelper.moveLeft();
        }
        break;
      case ValidControl.P:
        if (method === ControlMethod.KeyDown) {
          this.game.setIsPaused(!this.game.isPaused);
        }
        break;
      case ValidControl.Esc:
        this.game.setIsPaused(false);
        break;
      case ValidControl.Space:
        if (method === ControlMethod.KeyDown) {
          this.game.actionsHelper.speedBoost();
        }
        if (method === ControlMethod.KeyUp) {
          this.game.actionsHelper.normalSpeed();
        }
        break;
      default:
        break;
    }
  }
}

// TODO: think about removing this and moving it into Game.ts
import { ValidControl } from '../types/Enum';

export default class Controls {
  public currentControl: ValidControl = ValidControl.Null;

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
}

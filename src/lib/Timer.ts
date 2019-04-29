import Game from './Game';

export default class Timer {
  public game: Game;
  public remaining: number;
  public duration: number;

  private timeInterval: number;
  private isRunning: boolean;

  public constructor(game: Game, duration: number) {
    this.game = game;
    this.duration = this.toMiliseconds(duration);
    this.remaining = this.toMiliseconds(duration);
    this.timeInterval = 0;
    this.isRunning = false;
  }

  private toMiliseconds(seconds: number): number {
    return seconds * 1000;
  }

  private fromMiliseconds(miliseconds: number): number {
    let value = Math.floor(miliseconds / 1000);
    if (value < 1) {
      value = 0;
    }
    return value;
  }

  public start(callback?: Function): void {
    if (!this.isRunning) {
      this.isRunning = true;
      const aSecond = 1000;
      const tick = () => {
        if (this.remaining <= aSecond) {
          this.remaining = 0;
          this.game.setTimeRemaining('0');
          clearInterval(this.timeInterval);
          if (callback !== undefined) {
            callback();
          }
        } else {
          this.remaining = this.remaining - aSecond;
          this.game.setTimeRemaining(this.getTimeRemaining());
        }
      };
      this.timeInterval = setInterval(tick, aSecond);
    }
  }

  public stop(): void {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.timeInterval);
    }
  }

  public reset(): void {
    this.stop();
    this.remaining = this.duration;
    this.game.setTimeRemaining(this.getTimeRemaining());
  }

  public getTimeRemaining(): number {
    return this.fromMiliseconds(this.remaining);
  }
}

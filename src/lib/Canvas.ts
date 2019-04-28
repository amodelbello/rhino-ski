import Item from '../types/ItemType';

export default class Canvas {
  private ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  public constructor(
    ctx: CanvasRenderingContext2D,
    width: number = window.innerWidth,
    height: number = window.innerHeight
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public scale() {
    // TODO: Look into what this actually does
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  public save() {
    this.ctx.save();
  }

  public restore() {
    this.ctx.restore();
  }

  public draw(item: Item) {
    this.ctx.drawImage(
      item.image,
      item.xPosition,
      item.yPosition,
      Number(item.image.width),
      Number(item.image.height)
    );
  }
}

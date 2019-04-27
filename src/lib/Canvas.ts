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
    console.log(item);

    this.ctx.drawImage(
      item.image,
      item.xPosition,
      item.yPosition,
      Number(item.image.width),
      Number(item.image.height)
    );
  }

  public testDraw() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = 70;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'green';
    this.ctx.fill();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
  }
}

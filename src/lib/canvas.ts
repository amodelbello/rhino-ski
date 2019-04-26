export default class Canvas {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  public constructor(
    ctx: CanvasRenderingContext2D,
    width: number = window.innerWidth,
    height: number = window.innerHeight
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    console.log('canvas cleared', this.width, this.height);
  }
}




export class TuringAnimation {
  private canvasWidth: number;
  private canvasHeight: number;
  private cellSize: number;       //sq_size
  private nCell: number = 30;
  private middleTape: number;
  private rectGroup;
  private symbolGroup;
  private layer;
  x: number;
  y: number;

  constructor() {}

  init() {
    this.canvasWidth = document.getElementById("canvasWidth").offsetWidth;
    this.canvasWidth -=  this.canvasWidth * 0.006024;

    this.cellSize = this.canvasWidth / (25 - 2);
    this.canvasHeight = this.cellSize * 2;

    this.layer = new Kinetic.Layer();
    this.rectGroup = new Kinetic.Group({});
    this.symbolGroup = new Kinetic.Group({});


    let stage = new Kinetic.Stage({ //height => 0 wird nicht angezeigt!!!
      container: 'canvasWidth',
      width: this.canvasWidth,
      height: this.canvasHeight
    });

    this.x = 0;
    this.y = (this.canvasHeight - this.cellSize) / 2; //Mitte
    let middle = this.canvasWidth / 2;

    for( let i = 0; i <= this.nCell; i++) {

      this.x = this.cellSize * (i-1);

      let rectangle = new Kinetic.Rect({
        x: this.x,
        y: this.y,
        width: this.cellSize,
        height: this.cellSize,
        fill: '#428bca',
        stroke: 'white',
        strokeWidth: 2,
        cornerRadius: 2
      });

      if(((this.x + this.cellSize) >= middle) && (this.x <= middle)) {
        this.middleTape = i;
      }

      let symbol = new Kinetic.Text({
        x: this.cellSize * (i-1),
        y: this.y + (this.cellSize/6),
        fill: "white",
        text: " ",
        fontSize: (2 * this.cellSize/3) - (2 * this.cellSize/3) * 0.02,
        fontFamily: 'Helvetica',
        height: this.cellSize,
        width: this.cellSize,
        align: 'center',
      });


      this.x = this.x + this.cellSize + 20;

      this.rectGroup.add(rectangle);
      this.symbolGroup.add(symbol);

    }

    this.y = ((0.1) + (4/3)) * this.cellSize - this.cellSize/6;

    let poly = new Kinetic.RegularPolygon({
      x: (this.canvasWidth/2),
      y: (this.y + 2 * this.cellSize/5),
      sides: 3,
      radius: (this.cellSize/3),
      fill: '#000',
      stroke: '#000',
      strokeWidth: (4*2/3)
    });
    this.layer.add(this.rectGroup);
    this.layer.add(this.symbolGroup);
    this.layer.add(poly);
    stage.add(this.layer);

  }


}

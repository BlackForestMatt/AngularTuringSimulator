


export class TuringAnimation {
  private canvasWidth: number;
  private canvasHeight: number;
  private cellSize: number;       //sq_size
  private nCell: number = 30;
  private middleTape: number;
  private rectGroup;
  private symbolGroup;
  private layer;
  private current_despl: number = 0;
  private first_displayed: number = 0;



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

    let x = 0;
    let y = (this.canvasHeight - this.cellSize) / 2; //Mitte
    let middle = this.canvasWidth / 2;

    for( let i = 0; i <= this.nCell; i++) {

      x = this.cellSize * (i-1);

      let rectangle = new Kinetic.Rect({
        x: x,
        y: y,
        width: this.cellSize,
        height: this.cellSize,
        fill: '#428bca',
        stroke: 'white',
        strokeWidth: 2,
        cornerRadius: 2
      });

      if(((x + this.cellSize) >= middle) && (x <= middle)) {
        this.middleTape = i;
      }

      let symbol = new Kinetic.Text({
        x: this.cellSize * (i-1),
        y: y + (this.cellSize/6),
        fill: "white",
        text: " ",
        fontSize: (2 * this.cellSize/3) - (2 * this.cellSize/3) * 0.02,
        fontFamily: 'Helvetica',
        height: this.cellSize,
        width: this.cellSize,
        align: 'center',
      });


      x = x + this.cellSize + 20;

      this.rectGroup.add(rectangle);
      this.symbolGroup.add(symbol);

    }

    y = ((0.1) + (4/3)) * this.cellSize - this.cellSize/6;

    let poly = new Kinetic.RegularPolygon({
      x: (this.canvasWidth/2),
      y: (y + 2 * this.cellSize/5),
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

  animate(direction: number) {
    if (direction != 0) {

      this.first_displayed = (this.first_displayed - direction + this.nCell) % this.nCell;
      this.current_despl = this.current_despl + direction * this.cellSize;

      let to_move = (this.first_displayed - 1 + this.nCell) % this.nCell;
      console.log(to_move);
      let target_position = -this.current_despl + (this.nCell - 2) * this.cellSize;
      let square_to_move = this.rectGroup.getChildren()[to_move];

      let tween_squares = new (Kinetic as any).Tween({
        node: this.rectGroup,
        x: this.current_despl,
        duration: 2,
        easing: (Kinetic as any).Easings.EaseInOut,
        onFinish: () => {

        }
      });

      tween_squares.play();
    }
  }


  public loadInput(input: string) {
    let group = this.symbolGroup.getChildren();

    for (let i = 0; i < input.length; i++) {
      let char = input.charAt(i);
      group[this.middleTape+i].setText(char);
    }
    this.layer.draw();
  }

  public start() {

  }




}

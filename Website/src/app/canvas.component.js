"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var CanvasComponent = (function () {
    //@ViewChild("myCanvas") myCanvas;
    function CanvasComponent() {
        this.containerWidth = document.body.offsetWidth - 2;
        this.nCell = 25;
        this.current_despl = 0;
        this.first_displayed = 0;
        this.rectColor = "#0078FF";
    }
    CanvasComponent.prototype.ngAfterViewInit = function () {
        //let canvas = this.myCanvas.nativeElement;
        //this.context = canvas.getContext("2d");
        this.kinetic();
    };
    CanvasComponent.prototype.kinetic = function () {
        this.cellSize = this.containerWidth / (this.nCell - 2);
        this.containerHeight = this.cellSize * 2;
        var stage = new Kinetic.Stage({
            container: 'container2',
            width: this.containerWidth,
            height: this.containerHeight
        });
        var layer = new Kinetic.Layer();
        this.rectGroup = new Kinetic.Group({});
        this.x = 0;
        this.y = (this.containerHeight - this.cellSize) / 2; //Mitte
        for (var i = 0; i < 25; i++) {
            var rectangle = new Kinetic.Rect({
                x: this.cellSize * (i - 1),
                y: this.y,
                width: this.cellSize,
                height: this.cellSize,
                fill: "blue",
                stroke: "white",
                strokeWidth: 2,
                cornerRadius: 2
            });
            this.x = this.x + this.cellSize + 20;
            this.rectGroup.add(rectangle);
        }
        var pos_y = ((0.1) + (4 / 3)) * this.cellSize - this.cellSize / 6;
        var poly = new Kinetic.RegularPolygon({
            x: (this.containerWidth / 2),
            y: (pos_y + 2 * this.cellSize / 5),
            sides: 3,
            radius: (this.cellSize / 3),
            fill: "#000",
            stroke: "#000",
            strokeWidth: (4 * 2 / 3)
        });
        layer.add(this.rectGroup);
        layer.add(poly);
        stage.add(layer);
        var myCodeMirror = (CodeMirror).fromTextArea(document.getElementById('code_editor'), {
            mode: "text/html",
            width: "350px",
            lineNumbers: true
        });
    };
    CanvasComponent.prototype.animate = function () {
        var direction = -1; //Parameter -1 or 1
        this.first_displayed = (this.first_displayed - direction + this.nCell) % this.nCell;
        this.current_despl = this.current_despl + direction * this.cellSize;
        var to_move = (this.first_displayed - 1 + this.nCell) % this.nCell;
        console.log(to_move);
        var target_position = -this.current_despl + (this.nCell - 2) * this.cellSize;
        var square_to_move = this.rectGroup.getChildren()[to_move];
        console.log(this.current_despl);
        var tween_squares = new Kinetic.Tween({
            node: this.rectGroup,
            x: this.current_despl,
            duration: 2,
            easing: Kinetic.Easings.EaseInOut,
            onFinish: function () {
                //(square_to_move as any).setX(target_position);
            }
        });
        tween_squares.play();
    };
    CanvasComponent = __decorate([
        core_1.Component({
            selector: 'app-canvas',
            templateUrl: './canvas.component.html'
        })
    ], CanvasComponent);
    return CanvasComponent;
}());
exports.CanvasComponent = CanvasComponent;

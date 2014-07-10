/// <reference path="Point.ts" />
/// <reference path="Styles.ts" />
/// <reference path="Scale.ts" />
/// <reference path="Drawable.ts" />


declare var $;

class Graph {
    style: Styles;
    private _context: any;

    private _xMin: number;
    private _xMax: number;
    private _yMin: number;
    private _yMax: number;
    private _xLength: number;
    private _yLength: number;

    private _width: number;
    private _height: number;

    private _pointWidth: number;
    private _lineWidth: number;

    private _axes: boolean;
    private _gridLines: boolean;
    private _tabs: boolean;

    private _strokeStyle: string = "#000000";
    private _fillStyle: string = "#000000";

    private _scale: Scale;
    private _maxTicks: number = 10;

    private mouseDown: boolean = false;

    public xZoom: boolean = true;
    public yZoom: boolean = true;

    constructor(canvas: HTMLCanvasElement, xMin : number = -10, xMax : number = 10, yMin: number = -10, yMax: number = 10,
        axes: boolean = true, gridlines: boolean = true, tabs: boolean = true, style: Styles = new Styles()) {

        this._context = canvas.getContext("2d");

        this.style = style;

        this._height = canvas.height;
        this._width = canvas.width;

        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;

        this._axes = axes;
        this._gridLines = gridlines;
        this._tabs = tabs;

        this._scale = new Scale(this);

        this.drag();
        this.zoom();

        this.update();

    }


    update(recalculate: boolean = true) {
        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);

        if (recalculate) {
            this._xLength = this._xMax - this._xMin;
            this._yLength = this._yMax - this._yMin;

            if (this._xLength <= 0) {
                throw "xMax must be greater than or equal to xMin";
            }

            if (this._yLength <= 0) {
                throw "yMax must be greater than or equal to yMin";
            }

            this._scale.scale();
        }

        if (this._gridLines) {
            this.drawGridlines();
        }

        if (this._axes) {
            this.drawAxes();
        }

        if (this._tabs) {
           this.drawTabs();
        }

        this.drawLabels();

        this.drawFunction();

    }

    private drag(): void {
        var context: CanvasRenderingContext2D = this._context;
        var graph: Graph = this;
        var canvas: HTMLCanvasElement = context.canvas;
        var offset = $(canvas).offset();
        var newX: number;
        var newY: number;
        var oldX: number;
        var oldY: number;

        $(canvas).mousedown(function(e) {
            graph.mouseDown = true;

            oldX = e.pageX - offset.left;
            oldY = e.pageY - offset.top;

        });

        $(document).mouseup(function() {
            graph.mouseDown = false;
        });





        $(canvas).mousemove(function(e) {

            if (graph.mouseDown) {
                var newX: number = e.pageX - offset.left;
                var newY: number = e.pageY - offset.top;

                var oldXLength: number = graph.xLength;
                var oldYLength: number = graph.yLength;

                var xChange = Number(((newX - oldX) * graph.xResolution).toPrecision(1));
                var yChange = Number(((newY - oldY) * graph.yResolution).toPrecision(1));

                var xMin = graph.xMin - xChange;
                var xMax = graph.xMax - xChange;

                var yMin = graph.yMin + yChange;
                var yMax = graph.yMax + yChange;


                graph.setWindow(xMin, xMax, yMin, yMax);

                oldX = newX;
                oldY = newY;



            }
        });



    }

    private zoom(): void {

        var graph: Graph = this;

        $(canvas).mousewheel(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var parentOffset = $(this).parent().offset();

            var x: number = e.pageX - parentOffset.left;
            var y: number = e.pageY - parentOffset.top;

            var delta: number = e.deltaY;
            var factor: number = 1 + delta / 1000;

            var origin: Point = graph.point(0, 0);

            var xOffset = (x - origin.x) * graph.xResolution;
            var yOffset = (y - origin.y) * graph.yResolution;



            var xMin: number = (graph.xZoom) ? Number(((graph.xMin - xOffset) * factor + xOffset).toPrecision(20)) : graph.xMin;
            var xMax: number = (graph.xZoom) ? Number(((graph.xMax - xOffset) * factor + xOffset).toPrecision(20)) : graph.xMax;

            var yMin: number = (graph.yZoom) ? Number(((graph.yMin + yOffset) * factor - yOffset).toPrecision(20)) : graph.yMin;
            var yMax: number = (graph.yZoom) ? Number(((graph.yMax + yOffset) * factor - yOffset).toPrecision(20)) : graph.yMax;



            graph.setWindow(xMin, xMax, yMin, yMax);


        });


    }


    private drawCircle(center: Point, radius: number) {
        this._context.beginPath();
        this._context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        this._context.fill();
    }

    point(x: number, y: number): Point {
        return new Point(x, y, this);
    }

    drawPoint(point: Point): void {
        this._context.fillStyle = this.style.point;
        this.drawCircle(point, this.style.pointWidth);
    }

    drawLine(point1: Point, point2: Point, round: boolean = false): void {


        this._context.strokeStyle = this.style.line;
        this._context.lineWidth = this.style.lineWidth;

        var x1: number = (round) ? Math.round(point1.x) : point1.x;
        var x2: number = (round) ? Math.round(point2.x) : point2.x;

        var y1: number = (round) ? Math.round(point1.y) : point1.y;
        var y2: number = (round) ? Math.round(point2.y) : point2.y;

        var oldFill: string = this.style.fill;
        //Special cases of vertical or horizontal lines to prevent antialiasing
        if (x1 === x2) {
            var height: number = y2 - y1;
            oldFill = this.style.fill;
            this._context.fillStyle = this.style.line;

            x1 -= Math.floor(this.style.lineWidth / 2);

            this._context.fillRect(x1, y1, this.style.lineWidth, height);

            this.style.fill = oldFill;
        } else if (y1 === y2) {
            var width: number = x2 - x1;
            oldFill = this.style.fill;
            this._context.fillStyle = this.style.line;

            y1 -= Math.floor(this.style.lineWidth / 2);

            this._context.fillRect(x1, y1, width, this.style.lineWidth);

        } else {
            this._context.beginPath();
            this._context.moveTo(x1, y1);
            this._context.lineTo(x2, y2);
            this._context.stroke();
        }
        this._context.lineWidth = this.style.lineWidth;

    }

    drawHorizontal(y: number, round: boolean = true): void {
        var point: Point = this.point(0, y);
        y = (round) ? Math.round(point.y) : point.y;

        var oldFill: string = this.style.fill;
        this._context.fillStyle = this.style.line;

        if (this.style.lineWidth % 2 === 0) {
            y -= this.style.lineWidth / 2;
        } else {
            y -= Math.floor(this.style.lineWidth / 2);
        }

        this._context.fillRect(0, y, this._width, this.style.lineWidth);

        this._context.fillStyle = oldFill;


    }

    drawVertical(x: number, round: boolean = true) {
        var point: Point = this.point(x, 0);
        x = (round) ? Math.round(point.x) : point.x;

        var oldFill: string = this.style.fill;
        this._context.fillStyle = this.style.line;

        if (this.style.lineWidth % 2 === 0) {
            x -= this.style.lineWidth / 2;
        } else {
            x -= Math.floor(this.style.lineWidth / 2);
        }

        this._context.fillRect(x, 0, this.style.lineWidth, this._height);

        this.style.fill = oldFill;
    }

    private drawAxes(): void {

        var oldLine: string = this.style.line;
        var oldWidth: number = this.style.lineWidth;

        this.style.line = this.style.axes;
        this.style.lineWidth = this.style.axisWidth;

        this.drawHorizontal(0);
        this.drawVertical(0);

        this.style.line = oldLine;
        this.style.lineWidth = oldWidth;

    }

    private drawGridlines(): void {

        var oldLine: string = this.style.line;

        var xScale: number = this._scale.minorXScale;
        var yScale: number = this._scale.minorYScale;

        var i: number;

        this.style.line = this.style.minorGridLines;

        for (i = this._scale.minorXMin; i < this._scale.minorXMax; i += xScale) {
            this.drawVertical(i);
        }


        for (i = this._scale.minorYMin; i < this._scale.minorYMax; i += yScale) {
            this.drawHorizontal(i);
        }

        xScale = this._scale.majorXScale;
        yScale = this._scale.majorYScale;

        this.style.line = this.style.majorGridLines;

        for (i = this._scale.majorXMin; i < this._scale.majorXMax; i += xScale) {
            this.drawVertical(i);
        }


        for (i = this._scale.majorYMin; i < this._scale.majorYMax; i += yScale) {
            this.drawHorizontal(i);
        }


        this.style.line = oldLine;
    }

    drawTabs(color: string = "black") {
        this._context.strokeStyle = color;

        var tabWidth: number;
        var tabHeight: number;


        var majorTabWidth: number = 8 * this.xResolution;
        var majorTabHeight: number = 8 * this.yResolution;

        var minorTabWidth: number = 4 * this.xResolution;
        var minorTabHeight: number = 4 * this.yResolution;

        this.style.lineWidth = 1;

        var i: number;


        //Minor tabs
        for (i = this._scale.minorXMin; i < this._scale.minorXMax; i += this._scale.minorXScale) {
            this.drawLine(this.point(i, -minorTabHeight), this.point(i, minorTabHeight));
        }


        for (i = this._scale.minorYMin; i < this._scale.minorYMax; i += this._scale.minorYScale) {
            this.drawLine(this.point(-minorTabWidth, i), this.point(minorTabWidth, i));
        }



        //Major tabs

        for (i = this._scale.majorXMin; i < this._scale.majorXMax; i += this._scale.majorXScale) {
            this.drawLine(this.point(i, -majorTabHeight), this.point(i, majorTabHeight));
        }

        for (i = this._scale.majorYMin; i < this._scale.majorYMax; i += this._scale.majorYScale) {
            this.drawLine(this.point(-majorTabWidth, i), this.point(majorTabWidth, i));
        }

    }

    drawText(point: Point, text: string, align: string = "left", centerText: boolean = false): void {
        this.context.textAlign = align;
        var textWidth: number = this._context.measureText(text).width;
        this._context.fillText(text, (centerText) ? point.x - textWidth / 2 : point.x, point.y);
    }

    drawLabels(): void {

        var xScale = this._scale.majorXScale;

        var point: Point;

        var pixels: number = 15;


        for (var i = this._scale.majorXMin; i < this._scale.majorXMax; i += xScale) {

            //prevent it from plotting zero
            if (Math.abs(i) > xScale / 2) {

                if (this.yMin > 0) {
                    point = this.point(i, this.yMin + pixels * this.yResolution);
                } else if (this.yMax < 0) {
                    point = this.point(i, this.yMax - pixels * this.yResolution);
                } else if (xScale < -this.yMin) {
                    point = this.point(i, -this.yResolution * pixels);
                } else {
                    point = this.point(i, this.yResolution * pixels);

                }
           

                var message: string = parseFloat(i.toFixed(8)).toString();
                if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                    message = i.toExponential();
                }

                this.drawText(point, message, "left", true);


            }
        }

        var yScale: number = this._scale.majorYScale;

        this.context.textAlign = "end";

        for (var i = this._scale.majorYMin; i < this._scale.majorYMax; i += yScale) { 
            var align: string = "right";
            if (Math.abs(i) > yScale / 2) {

                if (this.xMin > 0) {
                    point = this.point(this.xMin + pixels * this.xResolution, i - 5 * this.yResolution);
                    align = "left";
                } else if (this.xMax < 0) {
                    point = this.point(this.xMax - pixels * this.xResolution, i - 5 * this.yResolution);
                } else if (yScale < -this.xMin) {
                    point = this.point(-this.yResolution * pixels, i - 5 * this.yResolution);
                } else {
                    point = this.point(this.yResolution * pixels, i - 5 * this.yResolution);
                    align = "left";
                }
           

                var message: string = parseFloat(i.toFixed(8)).toString();
                if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                    message = i.toExponential();
                }

                this.drawText(point, message, align);


            }
        }
    }



    get xMin(): number {
        return this._xMin;
    }
    set xMin(value: number) {
        this._xMin = value;
        this.update();
    }

    get xMax(): number {
        return this._xMax;
    }
    set xMax(value: number) {
        this._xMax = value;
        this.update();
    }


    get yMin(): number {
        return this._yMin;
    }
    set yMin(value: number) {
        this._yMin = value;
        this.update();
    }

    get yMax(): number {
        return this._yMax;
    }
    set yMax(value: number) {
        this._yMax = value;
        this.update();
    }



    get xLength(): number {
        return this._xLength;
    }

    get yLength(): number {
        return this._yLength;
    }



    get majorXScale(): number {
        return this._scale.majorXScale;
    }

    set majorXScale(value: number) {
        this._scale.majorXScale = value;
        this.update(false);
    }

    get minorXScale(): number {
        return this._scale.minorXScale;
    }

    set minorXScale(value: number) {
        this._scale.minorXScale = value;
        this.update(false);
    }

    get majorYScale(): number {
        return this._scale.majorYScale;
    }

    set majorYScale(value: number) {
        this._scale.majorYScale = value;
        this.update(false);
    }

    get minorYScale(): number {
        return this._scale.minorYScale;
    }

    set minorYScale(value: number) {
        this._scale.minorXScale = value;
        this.update(false);
    }

    get maxTicks() : number {
        return this._maxTicks;
    }

    set maxTicks(v : number) {
        this._maxTicks = v;
        this.update();
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get xResolution(): number {
        return this._xLength / this._width;
    }

    get yResolution(): number {
        return this._yLength / this.height;
    }

    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    setWindow(xMin: number = -10, xMax: number = 10, yMin: number = -10, yMax: number = 10) {
        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;

        this.update();
    }

    drawFunction() {
        var f = function(x): number {
            return Math.pow(Math.abs(x), 2 / 3);
        };

        var oldLine: string = this.style.line;

        this.style.line = this.style.equation;

        for (var i = this.xMin; i < this.xMax; i += this.xLength / this.width) {
            var lastX = i - (this.xLength / this.width);
            var lastY = f(lastX);

            this.drawLine(this.point(lastX, lastY), this.point(i, f(i)));
        }

        this.style.line = oldLine;
    }


}
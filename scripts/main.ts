/// <reference path="Point.ts" />
/// <reference path="Styles.ts" />
/// <reference path="Scale.ts" />


class Graph {    
    style: Styles;
    context: any;

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

    constructor(canvas: HTMLCanvasElement, xMin : number = -10, xMax : number = 10, yMin: number = -10, yMax: number = 10, 
        axes: boolean = true, gridlines: boolean = true, tabs: boolean = true, style: Styles = new Styles()) {
        

        this.context = canvas.getContext("2d");
        this.context.imageSmoothingEnabled = true;
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

        this.update();
    
    }
     
    
    update(recalculate: boolean = true) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        if(recalculate) {
            this._xLength = this._xMax - this._xMin;
            this._yLength = this._yMax - this._yMin;

            if(this._xLength <= 0) {
                throw "xMax must be greater than or equal to xMin";
            }

            if(this._yLength <= 0) {
                throw "yMax must be greater than or equal to yMin";
            }

            this._scale.scale();
        }

        if(this._gridLines) {
            this.drawGridlines();
        }

        if(this._axes) {
            this.drawAxes();
        }

        if(this._tabs) {
           this.drawTabs();
        }


    }

       
    private drawCircle(center: Point, radius: number) {
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        this.context.fill();
    }

    point(x: number, y: number): Point {
        return new Point(x, y, this);
    }

    drawPoint(point: Point): void {
        this.context.fillStyle = this.style.point;
        this.drawCircle(point, this.style.pointWidth);
    }

    drawLine(point1: Point, point2: Point, round: boolean = false): void {


        this.context.strokeStyle = this.style.line;
        this.context.lineWidth = this.style.lineWidth;

        var x1: number = (round) ? Math.round(point1.x) : point1.x;
        var x2: number = (round) ? Math.round(point2.x) : point2.x;

        var y1: number = (round) ? Math.round(point1.y) : point1.y;
        var y2: number = (round) ? Math.round(point2.y) : point2.y;

        //Special cases of vertical or horizontal lines to prevent antialiasing
        if(x1 == x2) {
            var height: number = y2 - y1;
            var oldFill: string = this.style.fill;
            this.context.fillStyle = this.style.line;

            x1 -= Math.floor(this.style.lineWidth / 2);

            this.context.fillRect(x1, y1, this.style.lineWidth, height);

            this.style.fill = oldFill;
        } else if(y1 == y2) {
            var width: number = x2 - x1;
            var oldFill: string = this.style.fill;
            this.context.fillStyle = this.style.line;

            y1 -= Math.floor(this.style.lineWidth / 2);

            this.context.fillRect(x1, y1, width, this.style.lineWidth);

        } else { 
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();
        }
        this.context.lineWidth = this.style.lineWidth;

    }

    drawHorizontal(y: number, round: boolean = true): void {
        var point: Point = this.point(0, y);
        y = (round)? Math.round(point.y): point.y;

        var oldFill: string = this.style.fill;
        this.context.fillStyle = this.style.line;

        if(this.style.lineWidth % 2 == 0) {
            y -= this.style.lineWidth / 2;
        } else {
            y -= Math.floor(this.style.lineWidth / 2);
        }

        this.context.fillRect(0, y, this._width, this.style.lineWidth);

        this.context.fillStyle = oldFill;

        
    }

    drawVertical(x: number, round: boolean = true) {
        var point: Point = this.point(x, 0);
        x = (round)? Math.round(point.x): point.x;

        var oldFill: string = this.style.fill;
        this.context.fillStyle = this.style.line;

        if(this.style.lineWidth % 2 == 0) {
            x -= this.style.lineWidth / 2;
        } else {
            x -= Math.floor(this.style.lineWidth / 2);
        }

        this.context.fillRect(x, 0, this.style.lineWidth, this._height);

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

        this.style.line = this.style.minorGridLines;

        for(var i = xScale; i < this._xMax; i += xScale) {
            this.drawVertical(i);
        }

        for(var i = -xScale; i > this._xMin; i -= xScale) {
            this.drawVertical(i);
        }

        for(var i = yScale; i < this._yMax; i += yScale) {
            this.drawHorizontal(i);
        }

        for(var i = -yScale; i > this._yMin; i -= yScale) {
            this.drawHorizontal(i);
        }


        xScale = this._scale.majorXScale;
        yScale = this._scale.majorYScale;

        this.style.line = this.style.majorGridLines;

        for(var i = xScale; i < this._xMax; i += xScale) {
            this.drawVertical(i);
        }

        for(var i = -xScale; i > this._xMin; i -= xScale) {
            this.drawVertical(i);
        }

        for(var i = yScale; i < this._yMax; i += yScale) {
            this.drawHorizontal(i);
        }

        for(var i = -yScale; i > this._yMin; i -= yScale) {
            this.drawHorizontal(i);
        }

        this.style.line = oldLine;
    }

    drawTabs(color: string = "black") {
        this.context.strokeStyle = color;

        var tabWidth: number;
        var tabHeight: number;


        var majorTabWidth: number = 1/8 * this._scale.majorXScale;
        var majorTabHeight: number = 1/8 * this._scale.majorYScale

        var minorTabWidth: number = 1/16 * this._scale.majorXScale;
        var minorTabHeight: number = 1/16 * this._scale.majorYScale;
            
        this.style.lineWidth = 1;

            
        //Minor tabs
        for(var i = 0; i < this._xMax; i += this._scale.minorXScale) {
            this.drawLine(this.point(i, -minorTabHeight), this.point(i, minorTabHeight));
        }

        for(var i = 0; i > this._xMin; i -= this._scale.minorXScale) {
            this.drawLine(this.point(i, -minorTabHeight), this.point(i, minorTabHeight));
        }

        for(var i = 0; i < this._yMax; i += this._scale.minorYScale) {
            this.drawLine(this.point(-minorTabWidth, i), this.point(minorTabWidth, i));
        }

        for(var i = 0; i > this._yMin; i -= this._scale.minorYScale) {
            this.drawLine(this.point(-minorTabWidth, i), this.point(minorTabWidth, i));
        }

        //Major tabs
        
        for(var i = 0; i < this._xMax; i += this._scale.majorXScale) {
            this.drawLine(this.point(i, -majorTabHeight), this.point(i, majorTabHeight));
        }

        for(var i = 0; i > this._xMin; i -= this._scale.majorXScale) {
            this.drawLine(this.point(i, -majorTabHeight), this.point(i, majorTabHeight));
        }

        for(var i = 0; i < this._yMax; i += this._scale.majorYScale) {
            this.drawLine(this.point(-majorTabWidth, i), this.point(majorTabWidth, i));
        }

        for(var i = 0; i > this._yMin; i -= this._scale.majorYScale) {
            this.drawLine(this.point(-majorTabWidth, i), this.point(majorTabWidth, i));
        }

        this.context.globalAlpha = 1;
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
    }

    get minorXScale(): number {
        return this._scale.minorXScale;
    } 

    set minorXScale(value: number) {
        this._scale.minorXScale = value;
    }

    get majorYScale(): number {
        return this._scale.majorYScale;
    }

    set majorYScale(value: number) {
        this._scale.majorYScale = value; 
    }

    get minorYScale(): number {
        return this._scale.minorYScale;
    } 

    set minorYScale(value: number) {
        this._scale.minorXScale = value;
    }

    get maxTicks() : number {
        return this._maxTicks;
    }

    set maxTicks(v : number) {
        this._maxTicks = v;
    }

    get width(): number {
        return this._width;
    }
            
    get height(): number {
        return this._height;
    }  
}



var canvas: any = document.getElementById("graph");
canvas.width = 600;
canvas.height = 600;
var graph = new Graph(canvas, -15, 15, -15, 15);

function f(x: number): number {
    return x*x;
}
graph.context.strokeStyle = "black";
for(var i = -10; i < 100; i+= graph.xLength / 600) {  
    var lastX = i - (graph.xLength / 600);
    var lastY = f(lastX);

    graph.drawLine(graph.point(lastX, lastY), graph.point(i, f(i)));
}


class Graph {    

    context: CanvasRenderingContext2D;
    private _xMin: number;
    private _xMax: number;
    private _yMin: number;
    private _yMax: number;
    private _xLength: number;
    private _yLength: number;
    private _majorXScale: number;
    private _minorXScale: number;
    private _majorYScale: number;
    private _minorYScale: number;
    
    private _width: number;
    private _height: number;

    private _pointWidth: number;
    private _lineWidth: number;

    private _axes: boolean;
    private _gridLines: boolean;
    private _tabs: boolean;
    
    private _strokeStyle: string = "#000000";
    private _fillStyle: string = "#000000";

    private _maxTicks: number = 20;
    constructor(canvas: HTMLCanvasElement, xMin : number = -10, xMax : number = 10, yMin: number = -10, yMax: number = 10, 
        lineWidth: number = 1, pointWidth: number = 1, axes: boolean = true, gridlines: boolean = true, tabs: boolean = true) {
        

        this.context = canvas.getContext("2d");
        this._height = canvas.height;
        this._width = canvas.width;
        
        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;
       

        this._lineWidth = lineWidth;
        this._pointWidth = pointWidth;

        this.context.lineWidth = lineWidth;

        this._axes = axes;
        this._gridLines = gridlines;
        this._tabs = tabs;

        this.update();
    
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
        return this._majorXScale;
    }

    set majorXScale(value: number) {
        this._majorXScale = value; 
    }

    get minorXScale(): number {
        return this._minorXScale;
    } 


    get width(): number {
        return this._width;
    }
            
    get height(): number {
        return this._height;
    }   

    update() {
        this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height);
        this._xLength = this._xMax - this._xMin;
        this._yLength = this._yMax - this._yMin;
    
        if(this._xLength <= 0) {
            throw "xMax must be greater than or equal to xMin";
        }

        if(this._yLength <= 0) {
            throw "yMax must be greater than or equal to yMin";
        }

        if(this._gridLines) {
            var xScales: Array<number> = this.scale(this._xLength);
            var yScales: Array<number> = this.scale(this._yLength);
            this.drawGridlines(xScales[0], yScales[0]);
            this.drawGridlines(xScales[1], yScales[1], "grey");

            console.log(xScales, yScales);
        }

        if(this._axes) {
            this.drawAxes();
        }

        if(this._tabs) {
            var xScales: Array<number> = this.scale(this._xLength);
            var yScales: Array<number> = this.scale(this._yLength);
            this.drawGridlines(xScales[0], yScales[0]);
            this.drawGridlines(xScales[1], yScales[1], "grey");
        }


    }

       
    drawCircle(center: Point, radius: number) {
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        this.context.fill();
    }

    point(x: number, y: number): Point {
        return new Point(x, y, this);
    }

    drawPoint(point: Point): void {
        this.drawCircle(point, this._pointWidth);
    }

    drawLine(point1: Point, point2: Point): void {
        this.context.beginPath();
        this.context.moveTo(point1.x, point1.y);
        this.context.lineTo(point2.x, point2.y);
        this.context.stroke();

    }

    private drawAxes(): void {

        this.context.strokeStyle = "black";
        this.context.lineWidth = 2;
        this.drawLine(this.point(this._xMin, 0), this.point(this._xMax, 0));
        this.drawLine(this.point(0, this._yMin), this.point(0, this._yMax));
        this.context.lineWidth = this._lineWidth;   

    }

    private drawGridlines(xScale: number, yScale: number, color: string = "lightgrey"): void {

        this.context.strokeStyle = color;

        for(var i = 0; i < this._xMax; i += xScale) {
            this.drawLine(this.point(i, this._yMin), this.point(i, this._yMax));
        }

        for(var i = 0; i > this._xMin; i -= xScale) {
            this.drawLine(this.point(i, this._yMin), this.point(i, this._yMax));
        }



        for(var i = 0; i < this._yMax; i += yScale) {
            this.drawLine(this.point(this._xMin, i), this.point(this._xMax, i));
        }

        for(var i = 0; i > this._yMin; i -= yScale) {
            this.drawLine(this.point(this._xMin, i), this.point(this._xMax, i));
        }
    }

    private drawTabs(xScale: number, yScale: number, isMajor: boolean = true, color:string = "black") {
        this.context.strokeStyle = color;

        var tabWidth: number;
        var tabHeight: number;

        if(isMajor) {
            tabWidth = 1/4 * xScale;
            tabHeight = 1/4 * yScale;
        } else {
            tabWidth = 1/8 * xScale;
            tabHeight = 1/8 * yScale;
        }

        for(var i = 0; i < this._xMax; i += xScale) {
            this.drawLine(this.point(i, -tabHeight), this.point(i, tabHeight));
        }

        for(var i = 0; i > this._xMin; i -= xScale) {
            this.drawLine(this.point(i, -tabWidth), this.point(i, tabWidth));
        }



        for(var i = 0; i < this._yMax; i += yScale) {
            this.drawLine(this.point(this._xMin, i), this.point(this._xMax, i));
        }

        for(var i = 0; i > this._yMin; i -= yScale) {
            this.drawLine(this.point(this._xMin, i), this.point(this._xMax, i));
        }
    }
    
    private scale(length: number): Array<number> {
        var niceRange: number = this.makeNice(length, false)[0];
        var scale: Array<number> = this.makeNice(niceRange / (this._maxTicks - 1), true);
        return scale;

    }

    private makeNice(num: number, round: boolean): Array<number> {
        var exponent: number = Math.floor(Math.log(num) / Math.log(10));
        var fraction: number = num / Math.pow(10, exponent);
        var niceFraction: number;

        if(round) {
            if(fraction < 1.5) {
                niceFraction = 1;
            } else if(fraction < 3) {
                niceFraction = 2;
            } else if(fraction < 7) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
        } else {
            if(fraction <= 1) {
                niceFraction = 1;
            } else if(fraction <= 2) {
                niceFraction = 2;
            } else if(fraction <= 5) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
        }


        var bigExponent: number;

        var niceExponent = niceFraction * Math.pow(10, exponent);
        if(niceFraction < 5) {
            bigExponent = niceExponent * 4;
        } else {
            bigExponent = niceExponent * 5;
        }

        return [niceExponent, bigExponent];

    }
        
}

class Point {
    x: number;
    y: number;
        
    private gridX: number;
    private gridY: number;
    //  var newX=x*(this.settings.width/this.settings.xlength),newY=-y*(this.settings.height/this.settings.ylength);

    constructor(x: number, y: number, graph: Graph) {
        var originX = -graph.xMin * graph.width / graph.xLength;
        var originY = graph.height + graph.yMin * graph.height / graph.yLength;



        this.x = originX + x * (graph.width / graph.xLength);
        this.y = originY - y * (graph.height / graph.yLength);

           
    }
    
    
}

var canvas: any = document.getElementById("graph");
canvas.width = 600;
canvas.height = 600;
var graph = new Graph(canvas, -10, 10, -10, 10);

function f(x: number): number {
    return x*Math.sin(Math.PI*x);
}
graph.context.strokeStyle = "black";
for(var i = -10; i < 100; i+= graph.xLength / 600) {  
    var lastX = i - (graph.xLength / 600);
    var lastY = f(lastX);

    graph.drawLine(graph.point(lastX, lastY), graph.point(i, f(i)));
}

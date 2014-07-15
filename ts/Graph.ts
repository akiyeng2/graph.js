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

    private _trace: Equation;
    private _shapes: Array<Drawable>;


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
        this._shapes = [];

        this.drag();
        this.zoom();

        this.add(new Equation('Math.sin(x)'))

        this.interpolate();

        this.update();

        

    }

    interpolate() {

        var graph: Graph = this;

        $(canvas).mousemove(function(e) {
            graph.update();
            var x: number = e.pageX - $(this).parent().offset().left;
            var origin: {x: number; y: number;} = new Point(0, 0).toCanvas(graph);

            x = (x - origin.x) * graph.xResolution;

            var fn: Equation = graph._trace;



            if(typeof fn !== "undefined") {

                var y: number = fn.f(x);

                new Point(x, y, fn.color, 3).draw(graph);
                var label = new Label(new Point(graph._xMin, graph._yMin), "(" + x + ", " + y + ")");
                graph.context.textBaseline = "bottom";
                label.color = fn.color;
                label.draw(graph);
                graph.context.textBaseline = "alphabetic";

            }


        });

    }

    public add(shape: Drawable) {
        this._shapes.push(shape);
        shape.add(this);
        if(shape instanceof Equation) {
            this.trace = <Equation>shape;
        }
        this.update();
    }

    public remove(shape: Drawable) {
        for (var i: number = this._shapes.length - 1; i >= 0; i--) {
            if(this._shapes[i].equals(shape)) {
                this._shapes.splice(i, 1);
            }
        }

        shape.remove(this);

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

        var graph: Graph = this;

        this._shapes.forEach(function(shape) {
            shape.draw(graph);
        });

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

            var origin = new Point(0, 0).toCanvas(graph);

            var xOffset = (x - origin.x) * graph.xResolution;
            var yOffset = (y - origin.y) * graph.yResolution;



            var xMin: number = (graph.xZoom) ? Number(((graph.xMin - xOffset) * factor + xOffset).toPrecision(21)) : graph.xMin;
            var xMax: number = (graph.xZoom) ? Number(((graph.xMax - xOffset) * factor + xOffset).toPrecision(21)) : graph.xMax;

            var yMin: number = (graph.yZoom) ? Number(((graph.yMin + yOffset) * factor - yOffset).toPrecision(21)) : graph.yMin;
            var yMax: number = (graph.yZoom) ? Number(((graph.yMax + yOffset) * factor - yOffset).toPrecision(21)) : graph.yMax;


            console.log()

            graph.setWindow(xMin, xMax, yMin, yMax);
            

        });


    }


    private drawAxes(): void {

        var xAxis: Line = new Line(new Point(this._xMin, 0), new Point(this._xMax, 0), "black", 2);
        var yAxis: Line = new Line(new Point(0, this._yMin), new Point(0, this._yMax), "black", 2);

        xAxis.draw(this);
        yAxis.draw(this);

    }


    private drawGridlines(): void {

        var oldLine: string = this.style.line;

        var xScale: number = this._scale.minorXScale;
        var yScale: number = this._scale.minorYScale;

        var x: number;
        var y: number;

        var color: string = this.style.minorGridLines;        

        var line: Line;

        for (x = this._scale.minorXMin; x < this._scale.minorXMax; x += xScale) {
            line = new Line(new Point(x, this._yMin), new Point(x, this._yMax), color);
            line.draw(this);
        }


        for (y = this._scale.minorYMin; y < this._scale.minorYMax; y += yScale) {
            line = new Line(new Point(this._xMin, y), new Point(this._xMax, y), color);
            line.draw(this);
        }

        xScale = this._scale.majorXScale;
        yScale = this._scale.majorYScale;

        color = this.style.majorGridLines;

        for (x = this._scale.majorXMin; x < this._scale.majorXMax; x += xScale) {
            line = new Line(new Point(x, this._yMin), new Point(x, this._yMax), color);
            line.draw(this);
        }


        for (y = this._scale.majorYMin; y < this._scale.majorYMax; y += yScale) {
            line = new Line(new Point(this._xMin, y), new Point(this._xMax, y), color);
            line.draw(this);
        }



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

        var line: Line;

        var x: number;
        var y: number;

        //Minor tabs

        var xScale: number = this._scale.minorXScale;
        var yScale: number = this._scale.minorYScale;

        for (x = this._scale.minorXMin; x < this._scale.minorXMax; x += xScale) {

            line = new Line(new Point(x, -minorTabHeight), new Point(x, minorTabHeight));
            line.draw(this);
        }


        for (y = this._scale.minorYMin; y < this._scale.minorYMax; y += yScale) {

            line = new Line(new Point(-minorTabWidth, y), new Point(minorTabWidth, y));
            line.draw(this);
        }



        //Major tabs

        var xScale: number = this._scale.majorXScale;
        var yScale: number = this._scale.majorYScale;

        for (x = this._scale.majorXMin; x < this._scale.majorXMax; x += xScale) {

            line = new Line(new Point(x, -majorTabHeight), new Point(x, majorTabHeight));
            line.draw(this);
        }


        for (y = this._scale.majorYMin; y < this._scale.majorYMax; y += yScale) {

            line = new Line(new Point(-majorTabWidth, y), new Point(majorTabWidth, y));
            line.draw(this);
        }

    }


    drawLabels(): void {

        var xScale = this._scale.majorXScale;

        var point: Point;

        var pixels: number = 20;


        for (var i = this._scale.majorXMin; i < this._scale.majorXMax; i += xScale) {

            //prevent it from plotting zero
            if (Math.abs(i) > xScale / 2) {

                if (this.yMin > 0) {
                    point = new Point(i, this.yMin + pixels * this.yResolution);
                } else if (this.yMax < 0) {
                    point = new Point(i, this.yMax - pixels * this.yResolution);
                } else if (xScale < -this.yMin) {
                    point = new Point(i, -this.yResolution * pixels);
                } else {
                    point = new Point(i, this.yResolution * pixels);

                }
           

                var message: string = parseFloat(i.toPrecision(8))  .toString();
                if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                    message = i.toExponential();
                }

                new Label(point, message, "start", true).draw(this);


            }
        }

        var yScale: number = this._scale.majorYScale;

        this.context.textAlign = "end";

        pixels = 15;

        for (var i = this._scale.majorYMin; i < this._scale.majorYMax; i += yScale) { 
            var align: string = "right";
            if (Math.abs(i) > yScale / 2) {

                if (this.xMin > 0) {
                    point = new Point(this.xMin + pixels * this.xResolution, i - 5 * this.yResolution);
                    align = "left";
                } else if (this.xMax < 0) {
                    point = new Point(this.xMax - pixels * this.xResolution, i - 5 * this.yResolution);
                } else if (yScale < -this.xMin) {
                    point = new Point(-this.yResolution * pixels, i - 5 * this.yResolution);
                } else {
                    point = new Point(this.yResolution * pixels, i - 5 * this.yResolution);
                    align = "left";
                }
           

                var message: string = parseFloat(i.toPrecision(8)).toString();
                if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                    message = i.toExponential();
                }

                new Label(point, message, align).draw(this);

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

    public get trace() : Equation {
        return <Equation>this._trace;
    }

    public set trace(v : Equation) {
        this._trace = v;
    }


    setWindow(xMin: number = -10, xMax: number = 10, yMin: number = -10, yMax: number = 10) {
        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;

        this.update();
    }

}
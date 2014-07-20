/// <reference path="Styles.ts" />
/// <reference path="Scale.ts" />
/// <reference path="Drawable.ts" />

/**
 * The namespace for the graph which encapsulates the graph object as well as all of the shapes
 * @namespace GraphPaper
 */
module GraphPaper {


    //Declare jQuery as a variable and import all of the submodules

    declare var $;

    import Scale = GraphPaper.Scale;
    import Styles = GraphPaper.Styles;

    import Drawable = GraphPaper.Drawable;
    import Point = GraphPaper.Shapes.Point;
    import Line = GraphPaper.Shapes.Line;
    import Label = GraphPaper.Shapes.Label;
    import Expression = GraphPaper.Shapes.Expression;


    export class Graph {
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


        private _axes: boolean;
        private _gridLines: boolean;
        private _tabs: boolean;

        private _scale: Scale;
        private _maxTicks: number = 10;

        private mouseDown: boolean = false;

        public xZoom: boolean = true;
        public yZoom: boolean = true;

        private _trace: Expression;
        private _shapes: Array<Drawable>;

        /**
         * This is the main class GraphPaper.Graph. It is used to initialize a new graph. By default a graph initializes
         * with a window of [-10, 10] by [-10, 10].
         *
         * @class GraphPaper.Graph
         * @classdesc GraphPaper.Graph is the starting point of the library.
         *
         * @param canvas {HTMLCanvasElement} The canvas to draw on
         * @param {number} [xMin = -10] The minimum of the x-axis
         * @param {number} [xMax = 10] The maximum of the x-axis
         * @param {number} [yMin = 10] The minimum of the y-axis
         * @param {number} [yMax = 10] The maximum of the y-axis
         * @param {boolean} [axes = true] Whether or not to display axes on the graph
         * @param {boolean} [gridlines = true] Whether or not to display gridlines on the graph
         * @param {boolean} [tabs = true] Whether or not to display tabs on the graph
         * @param {Styles} [style = The default styles] The styles of different objects on the graph
         */
        constructor(canvas: HTMLCanvasElement, xMin: number = -10, xMax: number = 10, yMin: number = -10, yMax: number = 10,
            axes: boolean = true, gridlines: boolean = true, tabs: boolean = true, style: Styles = new GraphPaper.Styles()) {

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


            this.interpolate();

            this.update();



        }

        /**
         * Sets up the event handler for tracing functions.
         * @private
         * @method GraphPaper.Graph#interpolate
         *
         */

        private interpolate(): void {

            var graph: Graph = this;

            var canvas: HTMLCanvasElement = this.context.canvas;

            $(canvas).mousemove(function(e) {
                graph.update();
                var x: number = e.pageX - $(this).parent().offset().left;
                var origin: { x: number; y: number; } = new Point(0, 0).toCanvas(graph);

                x = (x - origin.x) * graph.xResolution;

                var fn: Expression = graph._trace;



                if (typeof fn !== "undefined") {

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

        /**
         * This adds a shape to the graph that stays whenever the graph is redrawn
         * @method GraphPaper.Graph#add
         * @param {GraphPaper.Drawable} shape The shape that needs to be permanently added
         */

        public add(shape: Drawable) {
            this._shapes.push(shape);
            shape.add(this);
            if (shape instanceof Expression) {
                this.trace = <Expression>shape;
            }
            this.update();
        }

        /**
         * This removes shapes from the graph
         * @method GraphPaper.Graph#remove
         * @param {GraphPaper.Drawable} shape The shape to be removed
         */

        public remove(shape: Drawable) {
            for (var i: number = this._shapes.length - 1; i >= 0; i--) {
                if (this._shapes[i].equals(shape)) {
                    this._shapes.splice(i, 1);
                }
            }

            shape.remove(this);

            this.update();
        }

        /**
         *
         * This redraws everything on the graph
         * @method GraphPaper.Graph#update
         *
         * @param {boolean} [recalculate = true] If this is true, the graph will recalculate the resolution and scales
         */
        public update(recalculate: boolean = true) {
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

        /**
         * This method initializes the event listener for dragging
         * @method GraphPaper.Graph#drag
         */

        private drag(): void {
            var context: CanvasRenderingContext2D = this._context;
            var graph: Graph = this;
            var canvas: HTMLCanvasElement = context.canvas;
            var offset = $(canvas).offset();
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

        /**
         * This initializes the event listener for zooming
         * @method GraphPaper.Graph#zoom
         */

        private zoom(): void {

            var graph: Graph = this;
            var canvas: HTMLCanvasElement = this.context.canvas;

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



                graph.setWindow(xMin, xMax, yMin, yMax);


            });


        }

        /**
         * This draws the axes according to the style given
         * @method GraphPaper.Graph#drawAxes
         */

        private drawAxes(): void {

            var xAxis: Line = new Line(new Point(this._xMin, 0), new Point(this._xMax, 0), this.style.axes, this.style.axisWidth);
            var yAxis: Line = new Line(new Point(0, this._yMin), new Point(0, this._yMax), this.style.axes, this.style.axisWidth);

            xAxis.draw(this);
            yAxis.draw(this);

        }

        /**
         * This draws the gridlines according to the style given
         * @method GraphPaper.Graph#drawGridLines
         */

        private drawGridlines(): void {


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

        /**
         * This draws the ticks on the axes
         * @method GraphPaper.Graph#drawTabs
         */

        drawTabs() {
            this._context.strokeStyle = this.style.axes;

            var majorTabWidth: number = 8 * this.xResolution;
            var majorTabHeight: number = 8 * this.yResolution;

            var minorTabWidth: number = 4 * this.xResolution;
            var minorTabHeight: number = 4 * this.yResolution;

            this.style.lineWidth = 1;


            var line: Line;

            var x: number;
            var y: number;

            //Minor tabs

            var xScale: number = this._scale.minorXScale;
            var yScale: number = this._scale.minorYScale;

            for (x = this._scale.minorXMin; x < this._scale.minorXMax; x += xScale) {

                line = new Line(new Point(x, -minorTabHeight), new Point(x, minorTabHeight), this.style.axes);
                line.draw(this);
            }


            for (y = this._scale.minorYMin; y < this._scale.minorYMax; y += yScale) {

                line = new Line(new Point(-minorTabWidth, y), new Point(minorTabWidth, y), this.style.axes);
                line.draw(this);
            }



            //Major tabs

            var xScale: number = this._scale.majorXScale;
            var yScale: number = this._scale.majorYScale;

            for (x = this._scale.majorXMin; x < this._scale.majorXMax; x += xScale) {

                line = new Line(new Point(x, -majorTabHeight), new Point(x, majorTabHeight), this.style.axes);
                line.draw(this);
            }


            for (y = this._scale.majorYMin; y < this._scale.majorYMax; y += yScale) {

                line = new Line(new Point(-majorTabWidth, y), new Point(majorTabWidth, y), this.style.axes);
                line.draw(this);
            }

        }

        /**
         * This draws the ticks on the axes
         * @method GraphPaper.Graph#drawLabels
         */

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


                    var message: string = parseFloat(i.toPrecision(8)).toString();
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

        /**
         * This is the minimum x coordinate of the graph
         * @member {number} GraphPaper.Graph#xMin
         */

        get xMin(): number {
            return this._xMin;
        }
        set xMin(value: number) {
            this._xMin = value;
            this.update();
        }

        /**
         * This is the maximum x coordinate of the graph
         * @member {number} GraphPaper.Graph#xMax
         */

        get xMax(): number {
            return this._xMax;
        }
        set xMax(value: number) {
            this._xMax = value;
            this.update();
        }

        /**
         * This is the minimum y coordinate of the graph
         * @member {number} GraphPaper.Graph#yMin
         */

        get yMin(): number {
            return this._yMin;
        }
        set yMin(value: number) {
            this._yMin = value;
            this.update();
        }

        /**
         * This is the maxmimum y coordinate of the graph
         * @member {number} GraphPaper.Graph#yMax
         */

        get yMax(): number {
            return this._yMax;
        }
        set yMax(value: number) {
            this._yMax = value;
            this.update();
        }

        /**
         * This is the length of the x-axis, or xMax - xMin
         * @member {number} GraphPaper.Graph#xLength
         */

        get xLength(): number {
            return this._xLength;
        }

        /**
         * This is the length of the y-axis, or yMax - yMin
         * @member {number} GraphPaper.Graph#yLength
         */

        get yLength(): number {
            return this._yLength;
        }

        /**
         * This is how far apart the major x gridlines are from each other. It is calculated in {@link GraphPaper.Scale}
         * @member {number} GraphPaper.Graph#majorXScale
         */

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

        /**
         * This is how far apart the major y gridlines are form each other. It is calculated in {@link GraphPaper.Scale}
         * @member {number} GraphPaper.Graph#majorYScale
         */

        get majorYScale(): number {
            return this._scale.majorYScale;
        }

        set majorYScale(value: number) {
            this._scale.majorYScale = value;
            this.update(false);
        }

        /**
         * This is how far apart the minor y gridlines are from each other. It is calculated in {@link GraphPaper.Scale}
         * @member {number} GraphPaper.Graph#minorYScale
         */

        get minorYScale(): number {
            return this._scale.minorYScale;
        }

        set minorYScale(value: number) {
            this._scale.minorXScale = value;
            this.update(false);
        }

        /**
         * This is the maximum number of major gridlines in the graph. Changing this will change the tabs and gridlines
         * @member {number} GraphPaper.Graph#maxTicks
         */

        get maxTicks(): number {
            return this._maxTicks;
        }

        set maxTicks(v: number) {
            this._maxTicks = v;
            this.update();
        }

        /**
         * This is the width of the canvas
         * @member {number} GraphPaper.Graph#width
         */

        get width(): number {
            return this._width;
        }

        /**
         * This is the height of the canvas
         * @member {number} GraphPaper.Graph#height
         */

        get height(): number {
            return this._height;
        }

        /**
         * This is used in converting to and from pixels and coordinate length on the x-axis
         * @member {number} GraphPaper.Graph#xResolution
         */

        get xResolution(): number {
            return this._xLength / this._width;
        }

        get yResolution(): number {
            return this._yLength / this.height;
        }

        /**
         * This is used in converting to and from pixels and coordinate lengths on the y-axis
         * @member {number} GraphPaper.Graph#yResolution
         */

        get context(): CanvasRenderingContext2D {
            return this._context;
        }

        public get trace(): Expression {
            return <Expression>this._trace;
        }

        public set trace(v: Expression) {
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
}

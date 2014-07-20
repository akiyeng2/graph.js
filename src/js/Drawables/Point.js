/// <reference path="Line.ts" />
/// <reference path="Label.ts" />
/// <reference path="Expression.ts" />
var GraphPaper;
(function (GraphPaper) {
    /**
    * @namespace GraphPaper
    */
    /**
    * This provides all of the implementations of {GraphPaper.Drawable}
    * @namespace GraphPaper.Shapes
    */
    (function (Shapes) {
        var Point = (function () {
            /**
            * Constructor for a new point on a graph
            *
            * @class GraphPaper.Shapes.Point
            * @classdesc Provides a point with a coordinate system centered at 0, 0
            *
            * @param {number} x The x coordinate of the point in rectangular notation
            * @param {number} y The y coordinate of the point in rectangular notation
            * @param {string} [color = "black"] The color of the point
            * @param {number} [width = 3] The radius of the point
            */
            function Point(x, y, color, width) {
                if (typeof color === "undefined") { color = "black"; }
                if (typeof width === "undefined") { width = 3; }
                this._x = x;
                this._y = y;

                this._color = color;
                this._width = width;

                this._graphs = [];
            }
            /**
            * Draws the point on the graph temporarily.
            * @method GraphPaper.Shapes.Point#draw
            * @param {GraphPaper.graph} graph The graph to draw the point on
            */
            Point.prototype.draw = function (graph) {
                var coordinates = this.toCanvas(graph);

                graph.context.fillStyle = this._color;

                graph.context.beginPath();
                graph.context.arc(coordinates.x, coordinates.y, this.width, 0, Math.PI * 2, true);
                graph.context.closePath();
                graph.context.fill();
            };

            Point.prototype.updateGraphs = function () {
                for (var i = 0; i < this._graphs.length; i++) {
                    this._graphs[i].update();
                }
            };

            Point.prototype.add = function (graph) {
                this._graphs.push(graph);
            };

            Point.prototype.remove = function (graph) {
                for (var i = this._graphs.length - 1; i >= 0; i--) {
                    if (this._graphs[i] === graph) {
                        this._graphs.splice(i, 1);
                    }
                }
            };

            /**
            * This method converts the traditional graphing coordinate system.
            * @example
            * //returns {x: 250, y: 250}
            * var canvas = document.getElementById("canvas");
            * canvas.width = 500;
            * canvas.height = 500;
            * var graph = new GraphPaper.Graph(canvas)
            * new Point(0, 0).toCanvas(graph);
            *
            * @method GraphPaper.Shapes.Point#toCanvas
            *
            * @param {GraphPaper.graph} graph The graph that the points need to be converted on
            * @returns {Object} The points on the graph translated to the normal canvas coordinates
            * @returns {number} point.x: The x coordinate
            * @returns {number} point.y: The y coordinate
            */
            Point.prototype.toCanvas = function (graph) {
                var originX = -graph.xMin * graph.width / graph.xLength;
                var originY = graph.height + graph.yMin * graph.height / graph.yLength;

                var canvasX = originX + this._x * (graph.width / graph.xLength);
                var canvasY = originY - this._y * (graph.height / graph.yLength);

                return { x: canvasX, y: canvasY };
            };

            Point.prototype.equals = function (other) {
                return this.x === other.x && this.y === other.y && this.color.valueOf() === other.color.valueOf() && this.width === other.width;
            };

            Point.prototype.toString = function () {
                return "(" + this.x + ", " + this.y + ")";
            };

            Object.defineProperty(Point.prototype, "x", {
                /**
                * The x coordinate in rectangular notation
                * @member GraphPaper.Shapes.Point#x
                */
                get: function () {
                    return this._x;
                },
                set: function (v) {
                    this._x = v;
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Point.prototype, "y", {
                /**
                * The y coordinate in rectangular notation
                * @member GraphPaper.Shapes.Point#y
                */
                get: function () {
                    return this._y;
                },
                set: function (v) {
                    this._y = v;
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Point.prototype, "color", {
                /**
                * The color of the point
                * @member GraphPaper.Shapes.Point#color
                */
                get: function () {
                    return this._color;
                },
                set: function (v) {
                    this._color = v;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Point.prototype, "width", {
                /**
                * The radius of the point
                * @member GraphPaper.Shapes.Point#width
                */
                get: function () {
                    return this._width;
                },
                set: function (v) {
                    this._width = v;
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });

            return Point;
        })();
        Shapes.Point = Point;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));

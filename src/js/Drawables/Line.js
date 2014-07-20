/// <reference path="Point.ts" />
var GraphPaper;
(function (GraphPaper) {
    /**
    * @namespace GraphPaper
    */
    /**
    * @namespace GraphPaper.Shapes
    */
    (function (Shapes) {
        var Line = (function () {
            function Line(point1, point2, color, width) {
                if (typeof color === "undefined") { color = "black"; }
                if (typeof width === "undefined") { width = 1; }
                this._graphs = [];
                this._point1 = point1;
                this._point2 = point2;

                this._color = color;
                this._width = width;

                this._graphs = [];
            }
            Line.prototype.draw = function (graph) {
                graph.context.strokeStyle = this.color;
                graph.context.lineWidth = this.width;

                var pt1 = this.point1.toCanvas(graph);
                var pt2 = this.point2.toCanvas(graph);

                if (pt1.x === pt2.x) {
                    graph.context.fillStyle = this.color;
                    var x = pt1.x;
                    x -= Math.floor(this.width / 2);
                    graph.context.fillRect(x, pt1.y, this.width, pt2.y - pt1.y);
                } else if (pt1.y === pt2.y) {
                    graph.context.fillStyle = this.color;
                    var y = pt2.y;
                    y -= Math.floor(this.width / 2);
                    graph.context.fillRect(pt1.x, y, pt2.x - pt1.x, this.width);
                } else {
                    graph.context.beginPath();
                    graph.context.moveTo(pt1.x, pt1.y);
                    graph.context.lineTo(pt2.x, pt2.y);
                    graph.context.stroke();
                }
            };

            Line.prototype.updateGraphs = function () {
                for (var i = 0; i < this._graphs.length; i++) {
                    this._graphs[i].update();
                }
            };

            Line.prototype.add = function (graph) {
                this._graphs.push(graph);
            };

            Line.prototype.remove = function (graph) {
                for (var i = this._graphs.length - 1; i >= 0; i--) {
                    if (this._graphs[i] === graph) {
                        this._graphs.splice(i, 1);
                    }
                }
            };

            Line.prototype.equals = function (other) {
                return this.point1.equals(other.point1) && this.point2.equals(other.point2) && this.color.valueOf() === other.color.valueOf() && this.width === other.width;
            };

            Object.defineProperty(Line.prototype, "point1", {
                get: function () {
                    return this._point1;
                },
                set: function (v) {
                    this._point1 = v;
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Line.prototype, "point2", {
                get: function () {
                    return this._point2;
                },
                set: function (v) {
                    this._point2 = v;
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Line.prototype, "color", {
                get: function () {
                    return this._color;
                },
                set: function (v) {
                    this._color = v;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Line.prototype, "width", {
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

            return Line;
        })();
        Shapes.Line = Line;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));

/// <reference path="Point.ts" />
var GraphPaper;
(function (GraphPaper) {
    /**
    * @namespace GraphPaper.Shapes
    */
    (function (Shapes) {
        var Line = GraphPaper.Shapes.Line;

        var Expression = (function () {
            /**
            * This constructs an equation to be graphed
            *
            * @class GraphPaper.Shapes.Expression
            * @classdesc This provides an equation which is compiled from a string for drawing
            *
            * @param {string} eqn The equation in string format
            * @param {string} [color = "red"] The color of the equation
            */
            function Expression(eqn, color) {
                if (typeof color === "undefined") { color = "red"; }
                this._eqn = eqn;
                this._equation = new Equation(eqn);
                this.f = this._equation.compile();
                this._color = color;

                this._graphs = [];
            }
            /**
            * @method GraphPaper.Shapes.Expression#draw
            * @see GraphPaper.Drawable#draw
            */
            Expression.prototype.draw = function (graph) {
                for (var x = graph.xMin; x < graph.xMax; x += graph.xResolution) {
                    var lastX = x - (graph.xResolution);
                    var lastY = this.f(lastX);

                    var line = new Line(new GraphPaper.Shapes.Point(lastX, lastY), new GraphPaper.Shapes.Point(x, this.f(x)), this.color);
                    line.draw(graph);
                }
            };

            Expression.prototype.updateGraphs = function () {
                for (var i = 0; i < this._graphs.length; i++) {
                    this._graphs[i].update();
                }
            };

            Expression.prototype.equals = function (other) {
                return this.eqn === other.eqn && this.color === other.color;
            };

            Expression.prototype.toString = function () {
                return this._eqn;
            };

            Expression.prototype.add = function (graph) {
                this._graphs.push(graph);
            };

            Expression.prototype.remove = function (graph) {
                for (var i = this._graphs.length - 1; i >= 0; i--) {
                    if (this._graphs[i] === graph) {
                        this._graphs.splice(i, 1);
                    }
                }
            };

            Object.defineProperty(Expression.prototype, "eqn", {
                /**
                * This is the equation represented as a math string.
                * @member GraphPaper.Shapes.Expression#eqn
                */
                get: function () {
                    return this._eqn;
                },
                set: function (v) {
                    this.f = new Equation(v).compile();
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Expression.prototype, "color", {
                /**
                * The color of the equation
                * @member GraphPaper.Shapes.Expression#color
                */
                get: function () {
                    return this._color;
                },
                set: function (v) {
                    this._color = v;
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });

            return Expression;
        })();
        Shapes.Expression = Expression;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));

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
        var Line = GraphPaper.Shapes.Line;

        var Expression = (function () {
            function Expression(eqn, color) {
                if (typeof color === "undefined") { color = "red"; }
                this._eqn = eqn;
                this._equation = new Equation(eqn);
                this.f = function (x) {
                    return this._equation.evaluate('x', x);
                };

                this._color = color;

                this._graphs = [];
            }
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
                get: function () {
                    return this._eqn;
                },
                set: function (v) {
                    this.f = new Function("x", "return " + v);
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Expression.prototype, "color", {
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

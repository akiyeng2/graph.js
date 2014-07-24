/// <reference path="Point.ts" />
var GraphPaper;
(function (GraphPaper) {
    /**
    * @namespace GraphPaper.Shapes
    */
    (function (Shapes) {
        var Plot = (function () {
            function Plot(points, color, width) {
                if (typeof color === "undefined") { color = "black"; }
                if (typeof width === "undefined") { width = 1; }
                this._points = points;
                this._color = color;
                this._width = width;
                this._graphs = [];
            }
            Plot.prototype.draw = function (graph) {
                for (var i = 0; i < this._points.length - 1; i++) {
                    var point1 = this._points[i];
                    var point2 = this._points[i + 1];
                    var line = new Shapes.Line(point1, point2, this._color, this._width);
                    line.draw(graph);
                    point1.draw(graph);
                }
                this._points[this._points.length - 1].draw(graph);
            };

            Plot.prototype.add = function (graph) {
            };

            Plot.prototype.remove = function (graph) {
            };

            Plot.prototype.equals = function (other) {
                return true;
            };

            Plot.prototype.toString = function () {
                return "hi";
            };
            return Plot;
        })();
        Shapes.Plot = Plot;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));

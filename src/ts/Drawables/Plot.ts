/// <reference path="Point.ts" />


/**
 * @namespace GraphPaper.Shapes
 */

module GraphPaper.Shapes {

    import Graph = GraphPaper.Graph;

    import Drawable = GraphPaper.Drawable;
    import Point = GraphPaper.Shapes.Point;
    import Label = GraphPaper.Shapes.Label;
    import Expression = GraphPaper.Shapes.Label;

    export class Plot implements Drawable {

        private _points: Array<Point>;
        private _color: string;
        private _width: number;
        private _graphs: Array<Graph>;

        constructor(points: Array<Point>, color: string = "black", width: number = 1) {
            this._points = points;
            this._color = color;
            this._width = width;
            this._graphs = [];
        }

        draw(graph: Graph) {
            for (var i = 0; i < this._points.length - 1; i++) {
                var point1 = this._points[i];
                var point2 = this._points[i + 1];
                var line = new Line(point1, point2, this._color, this._width);
                line.draw(graph);
                point1.draw(graph);
            }
            this._points[this._points.length - 1].draw(graph);
        }

        add(graph: Graph) {
            print("hi");
        }

        remove(graph: Graph) {
            print("hi");
        }

        equals(other: Plot) {
            return true;
        }

        toString(): string {
            return "hi";
        }

    }


}

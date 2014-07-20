/// <reference path="Line.ts" />
/// <reference path="Label.ts" />
/// <reference path="Expression.ts" />


/**
 * @namespace GraphPaper
 */

/**
 * This provides all of the implementations of {GraphPaper.Drawable}
 * @namespace GraphPaper.Shapes
 */

module GraphPaper.Shapes {

    import Graph = GraphPaper.Graph;

    import Drawable = GraphPaper.Drawable;
    import Line = GraphPaper.Shapes.Line;
    import Label = GraphPaper.Shapes.Label;
    import Expression = GraphPaper.Shapes.Expression;



    export class Point implements Drawable {
        private _x: number;
        private _y: number;


        private _color: string;
        private _width: number;

        private _graphs: Array<Graph>;

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

        constructor(x: number, y: number, color: string = "black", width: number = 3) {


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

        draw(graph: Graph): void {
            var coordinates: {x: number; y: number;} = this.toCanvas(graph);

            graph.context.fillStyle = this._color;

            graph.context.beginPath();
            graph.context.arc(coordinates.x, coordinates.y, this.width, 0, Math.PI * 2, true);
            graph.context.closePath();
            graph.context.fill();


        }

        private updateGraphs() {
            for (var i = 0; i < this._graphs.length; i++) {
                this._graphs[i].update();
            }
        }

        public add(graph: Graph) {
            this._graphs.push(graph);
        }

        public remove(graph: Graph) {
            for(var i = this._graphs.length - 1; i >= 0; i--) {
                if(this._graphs[i] === graph) {
                   this._graphs.splice(i, 1);
                }
            }
        }



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

        toCanvas(graph: Graph): {x: number; y: number;} {
            var originX: number = -graph.xMin * graph.width / graph.xLength;
            var originY: number = graph.height + graph.yMin * graph.height / graph.yLength;

            var canvasX: number = originX + this._x * (graph.width / graph.xLength);
            var canvasY: number = originY - this._y * (graph.height / graph.yLength);

            return {x: canvasX, y: canvasY};
        }

        equals(other: Point): boolean {
            return this.x === other.x && this.y === other.y &&
            this.color.valueOf() === other.color.valueOf() && this.width === other.width;
        }

        toString(): string {
            return "(" + this.x + ", " + this.y + ")";
        }

        /**
         * The x coordinate in rectangular notation
         * @member GraphPaper.Shapes.Point#x
         */

        public get x() : number {
            return this._x;

        }

        public set x(v : number) {
            this._x = v;
            this.updateGraphs();
        }

        /**
         * The y coordinate in rectangular notation
         * @member GraphPaper.Shapes.Point#y
         */

        public get y() : number {
            return this._y;
        }

        public set y(v : number) {
            this._y = v;
            this.updateGraphs();
        }

        /**
         * The color of the point
         * @member GraphPaper.Shapes.Point#color
         */

        public get color() : string {
            return this._color;
        }

        public set color(v : string) {
            this._color = v;
        }

        /**
         * The radius of the point
         * @member GraphPaper.Shapes.Point#width
         */

        public get width() : number {
            return this._width;
        }

        public set width(v : number) {
            this._width = v;
            this.updateGraphs();
        }

    }

}

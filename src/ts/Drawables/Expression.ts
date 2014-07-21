/// <reference path="Point.ts" />


/**
 * @namespace GraphPaper.Shapes
 */

module GraphPaper.Shapes {

	declare var Equation;

    import Graph = GraphPaper.Graph;

    import Drawable = GraphPaper.Drawable;
	import Point = GraphPaper.Shapes.Point;

    import Line = GraphPaper.Shapes.Line;
    import Label = GraphPaper.Shapes.Label;




	export class Expression implements Drawable {
		public f: Function;
		private _eqn : string;
		private _equation: any;
		private _color: string;


		private _graphs: Array<Graph>;

        /**
         * This constructs an equation to be graphed
         *
         * @class GraphPaper.Shapes.Expression
         * @classdesc This provides an equation which is compiled from a string for drawing
         *
         * @param {string} eqn The equation in string format
         * @param {string} [color = "red"] The color of the equation
         */

		constructor(eqn: string, color: string = "red") {
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
		draw(graph: Graph): void {
			for (var x = graph.xMin; x < graph.xMax; x += graph.xResolution) {
	            var lastX = x - (graph.xResolution);
	            var lastY = this.f(lastX);

	            var line: Line = new Line(new GraphPaper.Shapes.Point(lastX, lastY), new GraphPaper.Shapes.Point(x, this.f(x)), this.color);
	            line.draw(graph);

	        }
		}

		private updateGraphs() {
			for (var i = 0; i < this._graphs.length; i++) {
				this._graphs[i].update();
			}
		}

		equals(other: Expression): boolean {
			return this.eqn === other.eqn && this.color === other.color;
		}

		toString(): string {
			return this._eqn;
		}

		public add(graph: Graph) {
			this._graphs.push(graph);
		}

		public remove(graph: Graph) {
			for ( var i = this._graphs.length - 1; i >= 0; i--) {
	    		if (this._graphs[i] === graph) {
	    		   this._graphs.splice(i, 1);
	    		}
			}

		}

        /**
         * This is the equation represented as a math string.
         * @member GraphPaper.Shapes.Expression#eqn
         */

		public get eqn() : string {
			return this._eqn;
		}
		public set eqn(v : string) {
			this.f = new Equation(v).compile();
			this.updateGraphs();
		}

        /**
         * The color of the equation
         * @member GraphPaper.Shapes.Expression#color
         */

		public get color() {
			return this._color;
		}

		public set color(v: string) {
			this._color = v;
			this.updateGraphs();
		}



	}

}

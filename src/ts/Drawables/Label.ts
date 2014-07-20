
/**
 * @namespace GraphPaper
 */

/**
 * @namespace GraphPaper.Shapes
 */

module GraphPaper.Shapes {

	import Graph = GraphPaper.Graph;

    import Drawable = GraphPaper.Drawable;
    import Point = GraphPaper.Shapes.Point;
    import Line = GraphPaper.Shapes.Line;
    import Expression = GraphPaper.Shapes.Label;

	export class Label implements Drawable {

		private _graphs: Array<Graph>;

		private _point: Point;
		private _text: string;
		private _align: string;
		private _centered: boolean;
		private _color: string;
		private _font: string;

		constructor(point: Point, text: string, align: string = "start",
			centered: boolean = false, color: string = "black", font: string = "10px sans-serif") {

			this._point = point;
			this._text = text;
			this._align = align;
			this._centered = centered;
			this._color = color;
			this._font = font;

			this._graphs = [];

		}

		public draw(graph: Graph) {
			var pt: {x: number; y: number; } = this._point.toCanvas(graph);


			if (this._centered) {
				pt.x -= Math.floor(graph.context.measureText(this._text).width / 2);
				pt.y -= Math.floor(graph.context.measureText("o").width / 2);
			}

			graph.context.textAlign = this._align;
			graph.context.font = this._font;
			graph.context.fillStyle = this._color;

			graph.context.fillText(this._text, pt.x, pt.y);

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
			for ( var i = this._graphs.length - 1; i >= 0; i--) {
	    		if (this._graphs[i] === graph) {
	    		   this._graphs.splice(i, 1);
	    		}
			}
		}

		equals(other: Label): boolean {
			return this._point.equals(other.point) && this._text.valueOf() === other.text.valueOf()
			&& this._align.valueOf() === other.align.valueOf() && this._centered === other.centered
			&& this._color.valueOf() === other.color.valueOf() && this._font.valueOf() === other.font.valueOf();
		}

		toString() {
			return this._text + " " + this._point.toString();
		}

		public get point() : Point {
			return this._point;
		}

		public set point(v : Point) {
			this._point = v;
			this.updateGraphs();
		}

		public get text() : string {
			return this._text;
		}

		public set text(v : string) {
			this._text = v;
			this.updateGraphs();
		}

		public get align() : string {
			return this._align;
		}

		public set align(v : string) {
			this._align = v;
		}

		public get centered() : boolean {
			return this._centered;
		}

		public set centered(v : boolean) {
			this._centered = v;
			this.updateGraphs();
		}

		public get color() : string {
			return this._color;
		}

		public set color(v : string) {
			this._color = v;
			this.updateGraphs();
		}

		public get font() : string {
			return this._font;
		}

		public set font(v : string) {
			this._font = v;
			this.updateGraphs();
		}

	}
}

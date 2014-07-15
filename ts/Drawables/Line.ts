class Line implements Drawable {
	private _point1: Point;
	private _point2 : Point;

	private _color : string;
	private _width: number;
	
	private _graphs: Array<Graph> = [];
	
	constructor(point1: Point, point2: Point, color: string = "black", width: number = 1) {
		this._point1 = point1;
		this._point2 = point2;

		this._color = color;
		this._width = width;

		this._graphs = [];
	}

	draw(graph: Graph): void {

		graph.context.strokeStyle = this.color;
		graph.context.lineWidth = this.width;

		var pt1: {x: number; y: number;} = this.point1.toCanvas(graph);
		var pt2: {x: number; y: number;} = this.point2.toCanvas(graph);

		if(pt1.x === pt2.x) {
			graph.context.fillStyle = this.color;
			var x: number = pt1.x;
			x -= Math.floor(this.width / 2);
			graph.context.fillRect(x, pt1.y, this.width, pt2.y - pt1.y);

		} else if(pt1.y === pt2.y) {
			graph.context.fillStyle = this.color;
			var y: number = pt2.y;
			y -= Math.floor(this.width / 2);
			graph.context.fillRect(pt1.x, y, pt2.x - pt1.x, this.width);
		} else {
			graph.context.beginPath();
			graph.context.moveTo(pt1.x, pt1.y);
			graph.context.lineTo(pt2.x, pt2.y);
			graph.context.stroke();
		}

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

	equals(other: Line) {
		return this.point1.equals(other.point1) && this.point2.equals(other.point2)
		&& this.color.valueOf() === other.color.valueOf() && this.width === other.width;
	}

	public get point1() : Point {
		return this._point1;
	}

	public set point1(v : Point) {
		this._point1 = v;
		this.updateGraphs();
	}

	public get point2() : Point {
		return this._point2;
	}

	public set point2(v : Point) {
		this._point2 = v;
		this.updateGraphs();
	}

	public get color() : string {
		return this._color;
	}

	public set color(v : string) {
		this._color = v;
	}

	public get width() : number {
		return this._width;
	}

	public set width(v : number) {
		this._width = v;
		this.updateGraphs();
	}

}
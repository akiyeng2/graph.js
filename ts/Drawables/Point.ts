class Point implements Drawable {
    private _x: number;
    private _y: number;


    private _color: string;
    private _width: number;

    private _graphs: Array<Graph>;

    constructor(x: number, y: number, color: string = "black", width: number = 3) {
        

        this._x = x;
        this._y = y;

        this._color = color;
        this._width = width;

        this._graphs = [];
    }

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

    public get x() : number {
        return this._x;
        
    }

    public set x(v : number) {
        this._x = v;
        this.updateGraphs();
    }

    public get y() : number {
        return this._y;
    }

    public set y(v : number) {
        this._y = v;
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

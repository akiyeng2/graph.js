class Scale {

	private graph: Graph;
	
	private _minorXMin: number;
	private _minorXMax: number;

    private _minorYMin: number;
    private _minorYMax: number;

    private _majorXMin: number;
    private _majorXMax: number;

    private _majorYMin: number;
    private _majorYMax: number;



	private _yMin: number;
	private _yMax: number;

	private _minorXScale: number;
	private _minorYScale: number;

    private _majorXScale: number;
    private _majorYScale: number;

	constructor(graph: Graph) {
		this.graph = graph;
		this.scale();
	}

	public scale() {

        var graph: Graph = this.graph;

        var xLength = this.makeNice(graph.xLength, false)[0] * Math.pow(10, this.makeNice(graph.xLength, false)[1]);
        var yLength = this.makeNice(graph.yLength, false)[0] * Math.pow(10, this.makeNice(graph.yLength, false)[1]);

        var xScale: Array<number> = this.makeNice(xLength / (graph.maxTicks - 1), true);
        var yScale: Array<number> = this.makeNice(yLength / (graph.maxTicks - 1), true);

        this._majorXScale = xScale[0] * Math.pow(10, xScale[1]);
        this._majorYScale = yScale[0] * Math.pow(10, yScale[1]);

        if(xScale[0] < 5) {
            this._minorXScale = 1/4 * this._majorXScale
        } else {
            this._minorXScale = 1/5 * this._majorXScale
        }

        if(yScale[0] < 5) {
            this._minorYScale = 1/4 * this._majorYScale;
        } else{
            this._minorYScale = 1/5 * this._majorYScale;
        }

        this._minorXMin = Math.floor(graph.xMin / this._minorXScale) * this._minorXScale;
        this._minorXMax = Math.ceil(graph.xMax / this._minorXScale) * this._minorXScale;

        this._majorXMin = Math.floor(graph.xMin / this._majorXScale) * this._majorXScale;
        this._majorXMax = Math.ceil(graph.xMax / this._majorXScale) * this._majorXScale;


        this._minorYMin = Math.floor(graph.yMin / this._minorYScale) * this._minorYScale;
        this._minorYMax = Math.ceil(graph.yMax / this._minorYScale) * this._minorYScale;

        this._majorYMin = Math.floor(graph.yMin / this._majorYScale) * this._majorYScale;
        this._majorYMax = Math.ceil(graph.yMax / this._majorYScale) * this._majorYScale;

    }

    public makeNice(num: number, round: boolean): Array<number> {
        var exponent: number = Math.floor(Math.log(num) / Math.log(10));
        var fraction: number = num / Math.pow(10, exponent);
        var niceFraction: number;

        if(round) {
            if(fraction < 1.5) {
                niceFraction = 1;
            } else if(fraction < 3) {
                niceFraction = 2;
            } else if(fraction < 7) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
        } else {
            if(fraction <= 1) {
                niceFraction = 1;
            } else if(fraction <= 2) {
                niceFraction = 2;
            } else if(fraction <= 5) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
        }

        return [niceFraction, exponent];
        

    }

    public get minorXScale() : number {
        return this._minorXScale;
    }

    public set minorXScale(v : number) {
        this._minorXScale = v;
    }

    public get majorXScale() : number {
        return this._majorXScale;
    }

    public set majorXScale(v : number) {
        this._majorXScale = v;
    }


    public get minorYScale() : number {
        return this._minorYScale;
    }

    public set minorYScale(v : number) {
        this._minorYScale = v;
    }

    public get majorYScale() : number {
        return this._majorYScale;
    }

    public set majorYScale(v : number) {
        this._majorYScale = v;
    }

    public get majorXMax() : number {
        return this._majorXMax;
    }

    public get majorXMin() : number {
        return this._majorXMin;
    }

    public get majorYMax() : number {
        return this._majorYMax;
    }

    public get majorYMin() : number {
        return this._majorYMin;
    }

}


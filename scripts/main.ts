class Graph {
    
    context: CanvasRenderingContext2D;
    private _xMin: number;
    private _xMax: number;
    private _yMin: number;
    private _yMax: number;
    private _xLength: number;
    private _yLength: number;
    private _origin: Point;
    
    width: number;
    height: number;
    
    
    constructor(canvas: HTMLCanvasElement, xMin : number = -10, xMax : number = 10, yMin: number = -10, yMax: number = 10) {
        this.context = canvas.getContext("2d");
        this.height = canvas.height;
        this.width = canvas.width;
        
        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;
        this._xLength = xMax - xMin;
        this._yLength = yMax - yMin;
        
        /*
        How to find origin:
        
        x: [-10, 20]
        (0, 300): (-10, 0)
        (600, 300): (20, 0)
        (300, 300): (5, 0)
        (200, 300): (0, 0)
        
        600 / 30 = 20
        
        Distance from left to center: 10
        Distance from center to right: 20
        
        0 + 10 * 20 = 200
        600 - 20 * 20 = 200
        
        Conversion of origin to canvas: -xMin * width / xLength
        Conversion of origin to canvas: -yMin * length / yLength
        
        y: [-10, 10]
        length: 600
        width: 600
        origin(canvas): (150, 300)
        
        
        
        
        */
       
        
        
    }
    
    get xMin(): number {
        return this._xMin;
    }
    
     get xMax(): number {
        return this._xMax;
    }
    
    get xLength(): number {
        return this._xLength;
    }
    
    get yMin(): number {
        return this._yMin;
    }
    
    get yMax(): number {
        return this._yMax;
    }
    
    get yLength(): number {
        return this._yLength;
    }
    
    
    
    
         
}

class Point {
    private x: number;
    private y: number;
    
    private canvasX: number;
    private canvasY: number;
    //	var newX=x*(this.settings.width/this.settings.xlength),newY=-y*(this.settings.height/this.settings.ylength);

    constructor(x: number, y: number, graph: Graph) {
        var originX = -graph.xMin * graph.width / graph.xLength;
        var originY = -graph.yMin * graph.height / graph.yLength;
        
        console.log(originX, originY);
        
    }
    
    
}

var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
var graph = new Graph(canvas);
new Point(0, 0, graph);

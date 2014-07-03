var Graph = (function () {
    function Graph(canvas, xMin, xMax, yMin, yMax) {
        if (typeof xMin === "undefined") { xMin = -10; }
        if (typeof xMax === "undefined") { xMax = 10; }
        if (typeof yMin === "undefined") { yMin = -10; }
        if (typeof yMax === "undefined") { yMax = 10; }
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
    Object.defineProperty(Graph.prototype, "xMin", {
        get: function () {
            return this._xMin;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "xMax", {
        get: function () {
            return this._xMax;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "xLength", {
        get: function () {
            return this._xLength;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "yMin", {
        get: function () {
            return this._yMin;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "yMax", {
        get: function () {
            return this._yMax;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "yLength", {
        get: function () {
            return this._yLength;
        },
        enumerable: true,
        configurable: true
    });
    return Graph;
})();

var Point = (function () {
    //	var newX=x*(this.settings.width/this.settings.xlength),newY=-y*(this.settings.height/this.settings.ylength);
    function Point(x, y, graph) {
        var originX = -graph.xMin * graph.width / graph.xLength;
        var originY = -graph.yMin * graph.height / graph.yLength;

        console.log(originX, originY);
    }
    return Point;
})();

var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
var graph = new Graph(canvas);
new Point(0, 0, graph);

var Graph = (function () {
    function Graph(canvas, xMin, xMax, yMin, yMax, lineWidth, pointWidth, axes, gridlines, tabs) {
        if (typeof xMin === "undefined") { xMin = -10; }
        if (typeof xMax === "undefined") { xMax = 10; }
        if (typeof yMin === "undefined") { yMin = -10; }
        if (typeof yMax === "undefined") { yMax = 10; }
        if (typeof lineWidth === "undefined") { lineWidth = 1; }
        if (typeof pointWidth === "undefined") { pointWidth = 1; }
        if (typeof axes === "undefined") { axes = true; }
        if (typeof gridlines === "undefined") { gridlines = true; }
        if (typeof tabs === "undefined") { tabs = true; }
        this._strokeStyle = "#000000";
        this._fillStyle = "#000000";
        this._maxTicks = 20;
        this.context = canvas.getContext("2d");
        this._height = canvas.height;
        this._width = canvas.width;

        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;

        this._lineWidth = lineWidth;
        this._pointWidth = pointWidth;

        this.context.lineWidth = lineWidth;

        this._axes = axes;
        this._gridLines = gridlines;
        this._tabs = tabs;

        this.update();
    }
    Object.defineProperty(Graph.prototype, "xMin", {
        get: function () {
            return this._xMin;
        },
        set: function (value) {
            this._xMin = value;
            this.update();
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "xMax", {
        get: function () {
            return this._xMax;
        },
        set: function (value) {
            this._xMax = value;
            this.update();
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "yMin", {
        get: function () {
            return this._yMin;
        },
        set: function (value) {
            this._yMin = value;
            this.update();
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "yMax", {
        get: function () {
            return this._yMax;
        },
        set: function (value) {
            this._yMax = value;
            this.update();
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

    Object.defineProperty(Graph.prototype, "yLength", {
        get: function () {
            return this._yLength;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "majorXScale", {
        get: function () {
            return this._majorXScale;
        },
        set: function (value) {
            this._majorXScale = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Graph.prototype, "minorXScale", {
        get: function () {
            return this._minorXScale;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });

    Graph.prototype.update = function () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this._xLength = this._xMax - this._xMin;
        this._yLength = this._yMax - this._yMin;

        if (this._xLength <= 0) {
            throw "xMax must be greater than or equal to xMin";
        }

        if (this._yLength <= 0) {
            throw "yMax must be greater than or equal to yMin";
        }

        if (this._gridLines) {
            var xScales = this.scale(this._xLength);
            var yScales = this.scale(this._yLength);
            this.drawGridlines(xScales[0], yScales[0]);
            this.drawGridlines(xScales[1], yScales[1], "grey");

            console.log(xScales, yScales);
        }

        if (this._axes) {
            this.drawAxes();
        }

        if (this._tabs) {
            var xScales = this.scale(this._xLength);
            var yScales = this.scale(this._yLength);
            this.drawGridlines(xScales[0], yScales[0]);
            this.drawGridlines(xScales[1], yScales[1], "grey");
        }
    };

    Graph.prototype.drawCircle = function (center, radius) {
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        this.context.fill();
    };

    Graph.prototype.point = function (x, y) {
        return new Point(x, y, this);
    };

    Graph.prototype.drawPoint = function (point) {
        this.drawCircle(point, this._pointWidth);
    };

    Graph.prototype.drawLine = function (point1, point2) {
        this.context.beginPath();
        this.context.moveTo(point1.x, point1.y);
        this.context.lineTo(point2.x, point2.y);
        this.context.stroke();
    };

    Graph.prototype.drawAxes = function () {
        this.context.strokeStyle = "black";
        this.context.lineWidth = 2;
        this.drawLine(this.point(this._xMin, 0), this.point(this._xMax, 0));
        this.drawLine(this.point(0, this._yMin), this.point(0, this._yMax));
        this.context.lineWidth = this._lineWidth;
    };

    Graph.prototype.drawGridlines = function (xScale, yScale, color) {
        if (typeof color === "undefined") { color = "lightgrey"; }
        this.context.strokeStyle = color;

        for (var i = 0; i < this._xMax; i += xScale) {
            this.drawLine(this.point(i, this._yMin), this.point(i, this._yMax));
        }

        for (var i = 0; i > this._xMin; i -= xScale) {
            this.drawLine(this.point(i, this._yMin), this.point(i, this._yMax));
        }

        for (var i = 0; i < this._yMax; i += yScale) {
            this.drawLine(this.point(this._xMin, i), this.point(this._xMax, i));
        }

        for (var i = 0; i > this._yMin; i -= yScale) {
            this.drawLine(this.point(this._xMin, i), this.point(this._xMax, i));
        }
    };

    Graph.prototype.drawTabs = function (xScale, yScale, isMajor, color) {
        if (typeof isMajor === "undefined") { isMajor = true; }
        if (typeof color === "undefined") { color = "black"; }
        this.context.strokeStyle = color;

        var tabWidth;
        var tabHeight;

        if (isMajor) {
            tabWidth = 1 / 4 * xScale;
            tabHeight = 1 / 4 * yScale;
        } else {
            tabWidth = 1 / 8 * xScale;
            tabHeight = 1 / 8 * yScale;
        }

        for (var i = 0; i < this._xMax; i += xScale) {
            this.drawLine(this.point(i, -tabHeight), this.point(i, tabHeight));
        }

        for (var i = 0; i > this._xMin; i -= xScale) {
            this.drawLine(this.point(i, -tabWidth), this.point(i, tabWidth));
        }

        for (var i = 0; i < this._yMax; i += yScale) {
            this.drawLine(this.point(this._xMin, i), this.point(this._xMax, i));
        }

        for (var i = 0; i > this._yMin; i -= yScale) {
            this.drawLine(this.point(this._xMin, i), this.point(this._xMax, i));
        }
    };

    Graph.prototype.scale = function (length) {
        var niceRange = this.makeNice(length, false)[0];
        var scale = this.makeNice(niceRange / (this._maxTicks - 1), true);
        return scale;
    };

    Graph.prototype.makeNice = function (num, round) {
        var exponent = Math.floor(Math.log(num) / Math.log(10));
        var fraction = num / Math.pow(10, exponent);
        var niceFraction;

        if (round) {
            if (fraction < 1.5) {
                niceFraction = 1;
            } else if (fraction < 3) {
                niceFraction = 2;
            } else if (fraction < 7) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
        } else {
            if (fraction <= 1) {
                niceFraction = 1;
            } else if (fraction <= 2) {
                niceFraction = 2;
            } else if (fraction <= 5) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
        }

        var bigExponent;

        var niceExponent = niceFraction * Math.pow(10, exponent);
        if (niceFraction < 5) {
            bigExponent = niceExponent * 4;
        } else {
            bigExponent = niceExponent * 5;
        }

        return [niceExponent, bigExponent];
    };
    return Graph;
})();

var Point = (function () {
    //  var newX=x*(this.settings.width/this.settings.xlength),newY=-y*(this.settings.height/this.settings.ylength);
    function Point(x, y, graph) {
        var originX = -graph.xMin * graph.width / graph.xLength;
        var originY = graph.height + graph.yMin * graph.height / graph.yLength;

        this.x = originX + x * (graph.width / graph.xLength);
        this.y = originY - y * (graph.height / graph.yLength);
    }
    return Point;
})();

var canvas = document.getElementById("graph");
canvas.width = 600;
canvas.height = 600;
var graph = new Graph(canvas, -10, 10, -10, 10);

function f(x) {
    return x * Math.sin(Math.PI * x);
}
graph.context.strokeStyle = "black";
for (var i = -10; i < 100; i += graph.xLength / 600) {
    var lastX = i - (graph.xLength / 600);
    var lastY = f(lastX);

    graph.drawLine(graph.point(lastX, lastY), graph.point(i, f(i)));
}

/*global $:false */
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
var Styles = (function () {
    function Styles(stroke, fill, point, line, equation, axes, minorGridLines, majorGridLines, pointWidth, lineWidth, axisWidth) {
        if (typeof stroke === "undefined") { stroke = "black"; }
        if (typeof fill === "undefined") { fill = "black"; }
        if (typeof point === "undefined") { point = "black"; }
        if (typeof line === "undefined") { line = "black"; }
        if (typeof equation === "undefined") { equation = "darkblue"; }
        if (typeof axes === "undefined") { axes = "#2363636"; }
        if (typeof minorGridLines === "undefined") { minorGridLines = "#E6E6E6"; }
        if (typeof majorGridLines === "undefined") { majorGridLines = "lightgrey"; }
        if (typeof pointWidth === "undefined") { pointWidth = 3; }
        if (typeof lineWidth === "undefined") { lineWidth = 1; }
        if (typeof axisWidth === "undefined") { axisWidth = 2; }
        this.stroke = stroke;
        this.fill = fill;
        this.point = point;
        this.line = line;
        this.equation = equation;
        this.axes = axes;
        this.minorGridLines = minorGridLines;
        this.majorGridLines = majorGridLines;
        this.pointWidth = pointWidth;
        this.lineWidth = lineWidth;
        this.axisWidth = axisWidth;
    }
    return Styles;
})();
var Scale = (function () {
    function Scale(graph) {
        this.graph = graph;
        this.scale();
    }
    Scale.prototype.scale = function () {
        var graph = this.graph;

        var xLength = this.makeNice(graph.xLength, false)[0] * Math.pow(10, this.makeNice(graph.xLength, false)[1]);
        var yLength = this.makeNice(graph.yLength, false)[0] * Math.pow(10, this.makeNice(graph.yLength, false)[1]);

        var xScale = this.makeNice(xLength / (graph.maxTicks - 1), true);
        var yScale = this.makeNice(yLength / (graph.maxTicks - 1), true);

        this._majorXScale = Number((xScale[0] * Math.pow(10, xScale[1])).toPrecision(1));
        this._majorYScale = Number((yScale[0] * Math.pow(10, yScale[1])).toPrecision(1));

        if (xScale[0] < 5) {
            this._minorXScale = 1 / 4 * this._majorXScale;
        } else {
            this._minorXScale = 1 / 5 * this._majorXScale;
        }

        if (yScale[0] < 5) {
            this._minorYScale = 1 / 4 * this._majorYScale;
        } else {
            this._minorYScale = 1 / 5 * this._majorYScale;
        }

        this._minorXMin = Math.floor(graph.xMin / this._minorXScale) * this._minorXScale;
        this._minorXMax = Math.ceil(graph.xMax / this._minorXScale) * this._minorXScale;

        this._majorXMin = Math.floor(graph.xMin / this._majorXScale) * this._majorXScale;
        this._majorXMax = Math.ceil(graph.xMax / this._majorXScale) * this._majorXScale;

        this._minorYMin = Math.floor(graph.yMin / this._minorYScale) * this._minorYScale;
        this._minorYMax = Math.ceil(graph.yMax / this._minorYScale) * this._minorYScale;

        this._majorYMin = Math.floor(graph.yMin / this._majorYScale) * this._majorYScale;
        this._majorYMax = Math.ceil(graph.yMax / this._majorYScale) * this._majorYScale;
    };

    Scale.prototype.makeNice = function (num, round) {
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

        return [niceFraction, exponent];
    };

    Object.defineProperty(Scale.prototype, "minorXScale", {
        get: function () {
            return this._minorXScale;
        },
        set: function (v) {
            this._minorXScale = v;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Scale.prototype, "majorXScale", {
        get: function () {
            return this._majorXScale;
        },
        set: function (v) {
            this._majorXScale = v;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Scale.prototype, "minorYScale", {
        get: function () {
            return this._minorYScale;
        },
        set: function (v) {
            this._minorYScale = v;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Scale.prototype, "majorYScale", {
        get: function () {
            return this._majorYScale;
        },
        set: function (v) {
            this._majorYScale = v;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Scale.prototype, "minorXMax", {
        get: function () {
            return this._majorXMax;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Scale.prototype, "minorXMin", {
        get: function () {
            return this._majorXMin;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Scale.prototype, "minorYMax", {
        get: function () {
            return this._majorYMax;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Scale.prototype, "minorYMin", {
        get: function () {
            return this._majorYMin;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Scale.prototype, "majorXMax", {
        get: function () {
            return this._majorXMax;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Scale.prototype, "majorXMin", {
        get: function () {
            return this._majorXMin;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Scale.prototype, "majorYMax", {
        get: function () {
            return this._majorYMax;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Scale.prototype, "majorYMin", {
        get: function () {
            return this._majorYMin;
        },
        enumerable: true,
        configurable: true
    });
    return Scale;
})();
/// <reference path="Point.ts" />
/// <reference path="Styles.ts" />
/// <reference path="Scale.ts" />

var Graph = (function () {
    function Graph(canvas, xMin, xMax, yMin, yMax, axes, gridlines, tabs, style) {
        if (typeof xMin === "undefined") { xMin = -10; }
        if (typeof xMax === "undefined") { xMax = 10; }
        if (typeof yMin === "undefined") { yMin = -10; }
        if (typeof yMax === "undefined") { yMax = 10; }
        if (typeof axes === "undefined") { axes = true; }
        if (typeof gridlines === "undefined") { gridlines = true; }
        if (typeof tabs === "undefined") { tabs = true; }
        if (typeof style === "undefined") { style = new Styles(); }
        this._strokeStyle = "#000000";
        this._fillStyle = "#000000";
        this._maxTicks = 10;
        this.mouseDown = false;
        this.xZoom = true;
        this.yZoom = true;
        this._context = canvas.getContext("2d");

        this.style = style;

        this._height = canvas.height;
        this._width = canvas.width;

        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;

        this._axes = axes;
        this._gridLines = gridlines;
        this._tabs = tabs;

        this._scale = new Scale(this);

        this.drag();
        this.zoom();

        this.update();
    }
    Graph.prototype.update = function (recalculate) {
        if (typeof recalculate === "undefined") { recalculate = true; }
        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);

        if (recalculate) {
            this._xLength = this._xMax - this._xMin;
            this._yLength = this._yMax - this._yMin;

            if (this._xLength <= 0) {
                throw "xMax must be greater than or equal to xMin";
            }

            if (this._yLength <= 0) {
                throw "yMax must be greater than or equal to yMin";
            }

            this._scale.scale();
        }

        if (this._gridLines) {
            this.drawGridlines();
        }

        if (this._axes) {
            this.drawAxes();
        }

        if (this._tabs) {
            this.drawTabs();
        }

        this.drawLabels();

        this.drawFunction();
    };

    Graph.prototype.drag = function () {
        var context = this._context;
        var graph = this;
        var canvas = context.canvas;
        var offset = $(canvas).offset();
        var newX;
        var newY;
        var oldX;
        var oldY;

        $(canvas).mousedown(function (e) {
            graph.mouseDown = true;

            oldX = e.pageX - offset.left;
            oldY = e.pageY - offset.top;
        });

        $(document).mouseup(function () {
            graph.mouseDown = false;
        });

        $(canvas).mousemove(function (e) {
            if (graph.mouseDown) {
                var newX = e.pageX - offset.left;
                var newY = e.pageY - offset.top;

                var xChange = Number(((newX - oldX) * graph.xResolution).toPrecision(5));
                var yChange = Number(((newY - oldY) * graph.yResolution).toPrecision(5));

                var xMin = graph.xMin - xChange;
                var xMax = graph.xMax - xChange;

                var yMin = graph.yMin + yChange;
                var yMax = graph.yMax + yChange;

                graph.setWindow(xMin, xMax, yMin, yMax);

                oldX = newX;
                oldY = newY;
            }
        });
    };

    Graph.prototype.zoom = function () {
        var graph = this;

        console.log($)

        $(canvas).mousewheel(function (e) {
            e.preventDefault();
            e.stopPropagation();

            var parentOffset = $(this).parent().offset();

            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var delta = e.deltaY;
            var factor = 1 + delta / 1000;

            var origin = graph.point(0, 0);

            var xOffset = (x - origin.x) * graph.xResolution;
            var yOffset = (y - origin.y) * graph.yResolution;

            var xMin = (graph.xZoom) ? Number(((graph.xMin - xOffset) * factor + xOffset).toPrecision(20)) : graph.xMin;
            var xMax = (graph.xZoom) ? Number(((graph.xMax - xOffset) * factor + xOffset).toPrecision(20)) : graph.xMax;

            var yMin = (graph.yZoom) ? Number(((graph.yMin + yOffset) * factor - yOffset).toPrecision(20)) : graph.yMin;
            var yMax = (graph.yZoom) ? Number(((graph.yMax + yOffset) * factor - yOffset).toPrecision(20)) : graph.yMax;

            graph.setWindow(xMin, xMax, yMin, yMax);
        });
    };

    Graph.prototype.drawCircle = function (center, radius) {
        this._context.beginPath();
        this._context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        this._context.fill();
    };

    Graph.prototype.point = function (x, y) {
        return new Point(x, y, this);
    };

    Graph.prototype.drawPoint = function (point) {
        this._context.fillStyle = this.style.point;
        this.drawCircle(point, this.style.pointWidth);
    };

    Graph.prototype.drawLine = function (point1, point2, round) {
        if (typeof round === "undefined") { round = false; }
        this._context.strokeStyle = this.style.line;
        this._context.lineWidth = this.style.lineWidth;

        var x1 = (round) ? Math.round(point1.x) : point1.x;
        var x2 = (round) ? Math.round(point2.x) : point2.x;

        var y1 = (round) ? Math.round(point1.y) : point1.y;
        var y2 = (round) ? Math.round(point2.y) : point2.y;

        var oldFill = this.style.fill;

        //Special cases of vertical or horizontal lines to prevent antialiasing
        if (x1 === x2) {
            var height = y2 - y1;
            oldFill = this.style.fill;
            this._context.fillStyle = this.style.line;

            x1 -= Math.floor(this.style.lineWidth / 2);

            this._context.fillRect(x1, y1, this.style.lineWidth, height);

            this.style.fill = oldFill;
        } else if (y1 === y2) {
            var width = x2 - x1;
            oldFill = this.style.fill;
            this._context.fillStyle = this.style.line;

            y1 -= Math.floor(this.style.lineWidth / 2);

            this._context.fillRect(x1, y1, width, this.style.lineWidth);
        } else {
            this._context.beginPath();
            this._context.moveTo(x1, y1);
            this._context.lineTo(x2, y2);
            this._context.stroke();
        }
        this._context.lineWidth = this.style.lineWidth;
    };

    Graph.prototype.drawHorizontal = function (y, round) {
        if (typeof round === "undefined") { round = true; }
        var point = this.point(0, y);
        y = (round) ? Math.round(point.y) : point.y;

        var oldFill = this.style.fill;
        this._context.fillStyle = this.style.line;

        if (this.style.lineWidth % 2 === 0) {
            y -= this.style.lineWidth / 2;
        } else {
            y -= Math.floor(this.style.lineWidth / 2);
        }

        this._context.fillRect(0, y, this._width, this.style.lineWidth);

        this._context.fillStyle = oldFill;
    };

    Graph.prototype.drawVertical = function (x, round) {
        if (typeof round === "undefined") { round = true; }
        var point = this.point(x, 0);
        x = (round) ? Math.round(point.x) : point.x;

        var oldFill = this.style.fill;
        this._context.fillStyle = this.style.line;

        if (this.style.lineWidth % 2 === 0) {
            x -= this.style.lineWidth / 2;
        } else {
            x -= Math.floor(this.style.lineWidth / 2);
        }

        this._context.fillRect(x, 0, this.style.lineWidth, this._height);

        this.style.fill = oldFill;
    };

    Graph.prototype.drawAxes = function () {
        var oldLine = this.style.line;
        var oldWidth = this.style.lineWidth;

        this.style.line = this.style.axes;
        this.style.lineWidth = this.style.axisWidth;

        this.drawHorizontal(0);
        this.drawVertical(0);

        this.style.line = oldLine;
        this.style.lineWidth = oldWidth;
    };

    Graph.prototype.drawGridlines = function () {
        var oldLine = this.style.line;

        var xScale = this._scale.minorXScale;
        var yScale = this._scale.minorYScale;

        var i;

        this.style.line = this.style.minorGridLines;

        for (i = this._scale.minorXMin; i < this._scale.minorXMax; i += xScale) {
            this.drawVertical(i);
        }

        for (i = this._scale.minorYMin; i < this._scale.minorYMax; i += yScale) {
            this.drawHorizontal(i);
        }

        xScale = this._scale.majorXScale;
        yScale = this._scale.majorYScale;

        this.style.line = this.style.majorGridLines;

        for (i = this._scale.majorXMin; i < this._scale.majorXMax; i += xScale) {
            this.drawVertical(i);
        }

        for (i = this._scale.majorYMin; i < this._scale.majorYMax; i += yScale) {
            this.drawHorizontal(i);
        }

        this.style.line = oldLine;
    };

    Graph.prototype.drawTabs = function (color) {
        if (typeof color === "undefined") { color = "black"; }
        this._context.strokeStyle = color;

        var tabWidth;
        var tabHeight;

        var majorTabWidth = 8 * this.xResolution;
        var majorTabHeight = 8 * this.yResolution;

        var minorTabWidth = 4 * this.xResolution;
        var minorTabHeight = 4 * this.yResolution;

        this.style.lineWidth = 1;

        var i;

        for (i = this._scale.minorXMin; i < this._scale.minorXMax; i += this._scale.minorXScale) {
            this.drawLine(this.point(i, -minorTabHeight), this.point(i, minorTabHeight));
        }

        for (i = this._scale.minorYMin; i < this._scale.minorYMax; i += this._scale.minorYScale) {
            this.drawLine(this.point(-minorTabWidth, i), this.point(minorTabWidth, i));
        }

        for (i = this._scale.majorXMin; i < this._scale.majorXMax; i += this._scale.majorXScale) {
            this.drawLine(this.point(i, -majorTabHeight), this.point(i, majorTabHeight));
        }

        for (i = this._scale.majorYMin; i < this._scale.majorYMax; i += this._scale.majorYScale) {
            this.drawLine(this.point(-majorTabWidth, i), this.point(majorTabWidth, i));
        }
    };

    Graph.prototype.drawText = function (point, text) {
        var textWidth = this._context.measureText(text).width;
        this._context.fillText(text, point.x - textWidth / 2, point.y);
    };

    Graph.prototype.drawLabels = function () {
        var xScale = this._scale.majorXScale;
        for (var i = this._scale.majorXMin; i < this._scale.majorXMax; i += xScale) {
            if (Math.abs(i) > xScale / 2) {
                var point = this.point(i, -this.yResolution * 20);

                var message = Number(i.toPrecision(15)).toString();
                if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                    message = i.toExponential();
                }

                this.drawText(point, message);
            }
        }
    };

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
            return this._scale.majorXScale;
        },
        set: function (value) {
            this._scale.majorXScale = value;
            this.update(false);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Graph.prototype, "minorXScale", {
        get: function () {
            return this._scale.minorXScale;
        },
        set: function (value) {
            this._scale.minorXScale = value;
            this.update(false);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Graph.prototype, "majorYScale", {
        get: function () {
            return this._scale.majorYScale;
        },
        set: function (value) {
            this._scale.majorYScale = value;
            this.update(false);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Graph.prototype, "minorYScale", {
        get: function () {
            return this._scale.minorYScale;
        },
        set: function (value) {
            this._scale.minorXScale = value;
            this.update(false);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Graph.prototype, "maxTicks", {
        get: function () {
            return this._maxTicks;
        },
        set: function (v) {
            this._maxTicks = v;
            this.update();
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

    Object.defineProperty(Graph.prototype, "xResolution", {
        get: function () {
            return this._xLength / this._width;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "yResolution", {
        get: function () {
            return this._yLength / this.height;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Graph.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });

    Graph.prototype.setWindow = function (xMin, xMax, yMin, yMax) {
        if (typeof xMin === "undefined") { xMin = -10; }
        if (typeof xMax === "undefined") { xMax = 10; }
        if (typeof yMin === "undefined") { yMin = -10; }
        if (typeof yMax === "undefined") { yMax = 10; }
        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;

        this.update();
    };

    Graph.prototype.drawFunction = function () {
        var f = function (x) {
            return x * x;
        };

        var oldLine = this.style.line;

        this.style.line = this.style.equation;

        for (var i = this.xMin; i < this.xMax; i += this.xLength / this.width) {
            var lastX = i - (this.xLength / this.width);
            var lastY = f(lastX);

            this.drawLine(this.point(lastX, lastY), this.point(i, f(i)));
        }

        this.style.line = oldLine;
    };
    return Graph;
})();
/// <reference path="Graph.ts" />
/*global $:false */
var canvas = document.getElementById("graph");
canvas.width = 600;
canvas.height = 600;
var graph = new Graph(canvas, -10, 10, -10, 10);

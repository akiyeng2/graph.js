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

        this._minorXScale = parseFloat(this._minorXScale.toPrecision(2));
        this._minorYScale = parseFloat(this._minorYScale.toPrecision(2));

        this._minorXMin = parseFloat((Math.floor(graph.xMin / this._minorXScale) * this._minorXScale).toPrecision(21));
        this._minorXMax = parseFloat((Math.ceil(graph.xMax / this._minorXScale) * this._minorXScale).toPrecision(21));

        this._majorXMin = parseFloat((Math.floor(graph.xMin / this._majorXScale) * this._majorXScale).toPrecision(21));
        this._majorXMax = parseFloat((Math.ceil(graph.xMax / this._majorXScale) * this._majorXScale).toPrecision(21));

        this._minorYMin = parseFloat((Math.floor(graph.yMin / this._minorYScale) * this._minorYScale).toPrecision(21));
        this._minorYMax = parseFloat((Math.ceil(graph.yMax / this._minorYScale) * this._minorYScale).toPrecision(21));

        this._majorYMin = parseFloat((Math.floor(graph.yMin / this._majorYScale) * this._majorYScale).toPrecision(21));
        this._majorYMax = parseFloat((Math.ceil(graph.yMax / this._majorYScale) * this._majorYScale).toPrecision(21));
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
var Point = (function () {
    function Point(x, y, color, width) {
        if (typeof color === "undefined") { color = "black"; }
        if (typeof width === "undefined") { width = 3; }
        this._x = x;
        this._y = y;

        this._color = color;
        this._width = width;

        this._graphs = [];
    }
    Point.prototype.draw = function (graph) {
        var coordinates = this.toCanvas(graph);

        graph.context.fillStyle = this._color;

        graph.context.beginPath();
        graph.context.arc(coordinates.x, coordinates.y, this.width, 0, Math.PI * 2, true);
        graph.context.closePath();
        graph.context.fill();
    };

    Point.prototype.updateGraphs = function () {
        for (var i = 0; i < this._graphs.length; i++) {
            this._graphs[i].update();
        }
    };

    Point.prototype.add = function (graph) {
        this._graphs.push(graph);
    };

    Point.prototype.remove = function (graph) {
        for (var i = this._graphs.length - 1; i >= 0; i--) {
            if (this._graphs[i] === graph) {
                this._graphs.splice(i, 1);
            }
        }
    };

    Point.prototype.toCanvas = function (graph) {
        var originX = -graph.xMin * graph.width / graph.xLength;
        var originY = graph.height + graph.yMin * graph.height / graph.yLength;

        var canvasX = originX + this._x * (graph.width / graph.xLength);
        var canvasY = originY - this._y * (graph.height / graph.yLength);

        return { x: canvasX, y: canvasY };
    };

    Point.prototype.equals = function (other) {
        return this.x === other.x && this.y === other.y && this.color.valueOf() === other.color.valueOf() && this.width === other.width;
    };

    Point.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ")";
    };

    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (v) {
            this._x = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Point.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (v) {
            this._y = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Point.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (v) {
            this._color = v;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Point.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (v) {
            this._width = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });

    return Point;
})();
var Line = (function () {
    function Line(point1, point2, color, width) {
        if (typeof color === "undefined") { color = "black"; }
        if (typeof width === "undefined") { width = 1; }
        this._graphs = [];
        this._point1 = point1;
        this._point2 = point2;

        this._color = color;
        this._width = width;

        this._graphs = [];
    }
    Line.prototype.draw = function (graph) {
        graph.context.strokeStyle = this.color;
        graph.context.lineWidth = this.width;

        var pt1 = this.point1.toCanvas(graph);
        var pt2 = this.point2.toCanvas(graph);

        if (pt1.x === pt2.x) {
            graph.context.fillStyle = this.color;
            var x = pt1.x;
            x -= Math.floor(this.width / 2);
            graph.context.fillRect(x, pt1.y, this.width, pt2.y - pt1.y);
        } else if (pt1.y === pt2.y) {
            graph.context.fillStyle = this.color;
            var y = pt2.y;
            y -= Math.floor(this.width / 2);
            graph.context.fillRect(pt1.x, y, pt2.x - pt1.x, this.width);
        } else {
            graph.context.beginPath();
            graph.context.moveTo(pt1.x, pt1.y);
            graph.context.lineTo(pt2.x, pt2.y);
            graph.context.stroke();
        }
    };

    Line.prototype.updateGraphs = function () {
        for (var i = 0; i < this._graphs.length; i++) {
            this._graphs[i].update();
        }
    };

    Line.prototype.add = function (graph) {
        this._graphs.push(graph);
    };

    Line.prototype.remove = function (graph) {
        for (var i = this._graphs.length - 1; i >= 0; i--) {
            if (this._graphs[i] === graph) {
                this._graphs.splice(i, 1);
            }
        }
    };

    Line.prototype.equals = function (other) {
        return this.point1.equals(other.point1) && this.point2.equals(other.point2) && this.color.valueOf() === other.color.valueOf() && this.width === other.width;
    };

    Object.defineProperty(Line.prototype, "point1", {
        get: function () {
            return this._point1;
        },
        set: function (v) {
            this._point1 = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Line.prototype, "point2", {
        get: function () {
            return this._point2;
        },
        set: function (v) {
            this._point2 = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Line.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (v) {
            this._color = v;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Line.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (v) {
            this._width = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });

    return Line;
})();
var Label = (function () {
    function Label(point, text, align, centered, color, font) {
        if (typeof align === "undefined") { align = "start"; }
        if (typeof centered === "undefined") { centered = false; }
        if (typeof color === "undefined") { color = "black"; }
        if (typeof font === "undefined") { font = "10px sans-serif"; }
        this._point = point;
        this._text = text;
        this._align = align;
        this._centered = centered;
        this._color = color;
        this._font = font;

        this._graphs = [];
    }
    Label.prototype.draw = function (graph) {
        var pt = this._point.toCanvas(graph);

        if (this._centered) {
            pt.x -= Math.floor(graph.context.measureText(this._text).width / 2);
            pt.y -= Math.floor(graph.context.measureText("o").width / 2);
        }

        graph.context.textAlign = this._align;
        graph.context.font = this._font;
        graph.context.fillStyle = this._color;

        graph.context.fillText(this._text, pt.x, pt.y);
    };

    Label.prototype.updateGraphs = function () {
        for (var i = 0; i < this._graphs.length; i++) {
            this._graphs[i].update();
        }
    };

    Label.prototype.add = function (graph) {
        this._graphs.push(graph);
    };

    Label.prototype.remove = function (graph) {
        for (var i = this._graphs.length - 1; i >= 0; i--) {
            if (this._graphs[i] === graph) {
                this._graphs.splice(i, 1);
            }
        }
    };

    Label.prototype.equals = function (other) {
        return this._point.equals(other.point) && this._text.valueOf() === other.text.valueOf() && this._align.valueOf() === other.align.valueOf() && this._centered === other.centered && this._color.valueOf() === other.color.valueOf() && this._font.valueOf() === other.font.valueOf();
    };

    Label.prototype.toString = function () {
        return this._text + " " + this._point.toString();
    };

    Object.defineProperty(Label.prototype, "point", {
        get: function () {
            return this._point;
        },
        set: function (v) {
            this._point = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Label.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (v) {
            this._text = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Label.prototype, "align", {
        get: function () {
            return this._align;
        },
        set: function (v) {
            this._align = v;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Label.prototype, "centered", {
        get: function () {
            return this._centered;
        },
        set: function (v) {
            this._centered = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Label.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (v) {
            this._color = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Label.prototype, "font", {
        get: function () {
            return this._font;
        },
        set: function (v) {
            this._font = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });

    return Label;
})();
var Expression = (function () {
    function Expression(eqn, color) {
        if (typeof color === "undefined") { color = "red"; }
        this._eqn = eqn;
        this._equation = new Equation(eqn);
        this.f = function (x) {
            return this._equation.evaluate('x', x);
        };

        this._color = color;

        this._graphs = [];
    }
    Expression.prototype.draw = function (graph) {
        for (var x = graph.xMin; x < graph.xMax; x += graph.xResolution) {
            var lastX = x - (graph.xResolution);
            var lastY = this.f(lastX);

            var line = new Line(new Point(lastX, lastY), new Point(x, this.f(x)), this.color);
            line.draw(graph);
        }
    };

    Expression.prototype.updateGraphs = function () {
        for (var i = 0; i < this._graphs.length; i++) {
            this._graphs[i].update();
        }
    };

    Expression.prototype.equals = function (other) {
        return this.eqn === other.eqn && this.color === other.color;
    };

    Expression.prototype.toString = function () {
        return this._eqn;
    };

    Expression.prototype.add = function (graph) {
        this._graphs.push(graph);
    };

    Expression.prototype.remove = function (graph) {
        for (var i = this._graphs.length - 1; i >= 0; i--) {
            if (this._graphs[i] === graph) {
                this._graphs.splice(i, 1);
            }
        }
    };

    Object.defineProperty(Expression.prototype, "eqn", {
        get: function () {
            return this._eqn;
        },
        set: function (v) {
            this.f = new Function("x", "return " + v);
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Expression.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (v) {
            this._color = v;
            this.updateGraphs();
        },
        enumerable: true,
        configurable: true
    });

    return Expression;
})();
/// <reference path="Drawables/Point.ts" />
/// <reference path="Drawables/Line.ts" />
/// <reference path="Drawables/Label.ts" />
/// <reference path="Drawables/Expression.ts" />
/// <reference path="Styles.ts" />
/// <reference path="Scale.ts" />
/// <reference path="Drawable.ts" />

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
        this._shapes = [];

        this.drag();
        this.zoom();

        this.add(new Expression('ln (x)'));

        this.interpolate();

        this.update();
    }
    Graph.prototype.interpolate = function () {
        var graph = this;

        $(canvas).mousemove(function (e) {
            graph.update();
            var x = e.pageX - $(this).parent().offset().left;
            var origin = new Point(0, 0).toCanvas(graph);

            x = (x - origin.x) * graph.xResolution;

            var fn = graph._trace;

            if (typeof fn !== "undefined") {
                var y = fn.f(x);

                new Point(x, y, fn.color, 3).draw(graph);
                var label = new Label(new Point(graph._xMin, graph._yMin), "(" + x + ", " + y + ")");
                graph.context.textBaseline = "bottom";
                label.color = fn.color;
                label.draw(graph);
                graph.context.textBaseline = "alphabetic";
            }
        });
    };

    Graph.prototype.add = function (shape) {
        this._shapes.push(shape);
        shape.add(this);
        if (shape instanceof Expression) {
            this.trace = shape;
        }
        this.update();
    };

    Graph.prototype.remove = function (shape) {
        for (var i = this._shapes.length - 1; i >= 0; i--) {
            if (this._shapes[i].equals(shape)) {
                this._shapes.splice(i, 1);
            }
        }

        shape.remove(this);

        this.update();
    };

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

        var graph = this;

        this._shapes.forEach(function (shape) {
            shape.draw(graph);
        });
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

                var oldXLength = graph.xLength;
                var oldYLength = graph.yLength;

                var xChange = Number(((newX - oldX) * graph.xResolution).toPrecision(1));
                var yChange = Number(((newY - oldY) * graph.yResolution).toPrecision(1));

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

        $(canvas).mousewheel(function (e) {
            e.preventDefault();
            e.stopPropagation();

            var parentOffset = $(this).parent().offset();

            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var delta = e.deltaY;
            var factor = 1 + delta / 1000;

            var origin = new Point(0, 0).toCanvas(graph);

            var xOffset = (x - origin.x) * graph.xResolution;
            var yOffset = (y - origin.y) * graph.yResolution;

            var xMin = (graph.xZoom) ? Number(((graph.xMin - xOffset) * factor + xOffset).toPrecision(21)) : graph.xMin;
            var xMax = (graph.xZoom) ? Number(((graph.xMax - xOffset) * factor + xOffset).toPrecision(21)) : graph.xMax;

            var yMin = (graph.yZoom) ? Number(((graph.yMin + yOffset) * factor - yOffset).toPrecision(21)) : graph.yMin;
            var yMax = (graph.yZoom) ? Number(((graph.yMax + yOffset) * factor - yOffset).toPrecision(21)) : graph.yMax;

            console.log();

            graph.setWindow(xMin, xMax, yMin, yMax);
        });
    };

    Graph.prototype.drawAxes = function () {
        var xAxis = new Line(new Point(this._xMin, 0), new Point(this._xMax, 0), "black", 2);
        var yAxis = new Line(new Point(0, this._yMin), new Point(0, this._yMax), "black", 2);

        xAxis.draw(this);
        yAxis.draw(this);
    };

    Graph.prototype.drawGridlines = function () {
        var oldLine = this.style.line;

        var xScale = this._scale.minorXScale;
        var yScale = this._scale.minorYScale;

        var x;
        var y;

        var color = this.style.minorGridLines;

        var line;

        for (x = this._scale.minorXMin; x < this._scale.minorXMax; x += xScale) {
            line = new Line(new Point(x, this._yMin), new Point(x, this._yMax), color);
            line.draw(this);
        }

        for (y = this._scale.minorYMin; y < this._scale.minorYMax; y += yScale) {
            line = new Line(new Point(this._xMin, y), new Point(this._xMax, y), color);
            line.draw(this);
        }

        xScale = this._scale.majorXScale;
        yScale = this._scale.majorYScale;

        color = this.style.majorGridLines;

        for (x = this._scale.majorXMin; x < this._scale.majorXMax; x += xScale) {
            line = new Line(new Point(x, this._yMin), new Point(x, this._yMax), color);
            line.draw(this);
        }

        for (y = this._scale.majorYMin; y < this._scale.majorYMax; y += yScale) {
            line = new Line(new Point(this._xMin, y), new Point(this._xMax, y), color);
            line.draw(this);
        }
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

        var line;

        var x;
        var y;

        //Minor tabs
        var xScale = this._scale.minorXScale;
        var yScale = this._scale.minorYScale;

        for (x = this._scale.minorXMin; x < this._scale.minorXMax; x += xScale) {
            line = new Line(new Point(x, -minorTabHeight), new Point(x, minorTabHeight));
            line.draw(this);
        }

        for (y = this._scale.minorYMin; y < this._scale.minorYMax; y += yScale) {
            line = new Line(new Point(-minorTabWidth, y), new Point(minorTabWidth, y));
            line.draw(this);
        }

        //Major tabs
        var xScale = this._scale.majorXScale;
        var yScale = this._scale.majorYScale;

        for (x = this._scale.majorXMin; x < this._scale.majorXMax; x += xScale) {
            line = new Line(new Point(x, -majorTabHeight), new Point(x, majorTabHeight));
            line.draw(this);
        }

        for (y = this._scale.majorYMin; y < this._scale.majorYMax; y += yScale) {
            line = new Line(new Point(-majorTabWidth, y), new Point(majorTabWidth, y));
            line.draw(this);
        }
    };

    Graph.prototype.drawLabels = function () {
        var xScale = this._scale.majorXScale;

        var point;

        var pixels = 20;

        for (var i = this._scale.majorXMin; i < this._scale.majorXMax; i += xScale) {
            //prevent it from plotting zero
            if (Math.abs(i) > xScale / 2) {
                if (this.yMin > 0) {
                    point = new Point(i, this.yMin + pixels * this.yResolution);
                } else if (this.yMax < 0) {
                    point = new Point(i, this.yMax - pixels * this.yResolution);
                } else if (xScale < -this.yMin) {
                    point = new Point(i, -this.yResolution * pixels);
                } else {
                    point = new Point(i, this.yResolution * pixels);
                }

                var message = parseFloat(i.toPrecision(8)).toString();
                if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                    message = i.toExponential();
                }

                new Label(point, message, "start", true).draw(this);
            }
        }

        var yScale = this._scale.majorYScale;

        this.context.textAlign = "end";

        pixels = 15;

        for (var i = this._scale.majorYMin; i < this._scale.majorYMax; i += yScale) {
            var align = "right";
            if (Math.abs(i) > yScale / 2) {
                if (this.xMin > 0) {
                    point = new Point(this.xMin + pixels * this.xResolution, i - 5 * this.yResolution);
                    align = "left";
                } else if (this.xMax < 0) {
                    point = new Point(this.xMax - pixels * this.xResolution, i - 5 * this.yResolution);
                } else if (yScale < -this.xMin) {
                    point = new Point(-this.yResolution * pixels, i - 5 * this.yResolution);
                } else {
                    point = new Point(this.yResolution * pixels, i - 5 * this.yResolution);
                    align = "left";
                }

                var message = parseFloat(i.toPrecision(8)).toString();
                if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                    message = i.toExponential();
                }

                new Label(point, message, align).draw(this);
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

    Object.defineProperty(Graph.prototype, "trace", {
        get: function () {
            return this._trace;
        },
        set: function (v) {
            this._trace = v;
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
    return Graph;
})();
/// <reference path="Graph.ts" />
/*global $:false */
var canvas = document.getElementById("graph");
canvas.width = 500;
canvas.height = 500;
var graph = new Graph(canvas, -10, 10, -10, 10);

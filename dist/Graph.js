/// <reference path="Graph.ts" />
/**
* @namespace GraphPaper
*/
var GraphPaper;
(function (GraphPaper) {
    var Styles = (function () {
        /**
        * The default constructor for the styles of a graph
        *
        * @class GraphPaper.Styles
        * @classdesc This class provides several styles that are used in a graph object
        *
        * @param {string} [stroke = "black"] The default stroke style
        * @param {string} [fill = "black"] The default fill style
        * @param {string} [point = "black"] The default point color
        * @param {string} [line = "black"] The default line color
        * @param {string} [equation = "red"] The default equation color
        * @param {string} [axes = "black"] The default color of the axes
        * @param {string} [minorGridLines = "#E6E6E6"] The default color of the minor gridlines
        * @param {string} [majorGridLines = "lightgrey"] The default color of the major gridlines
        * @param {number} [pointWidth = 3] The default radius of a point
        * @param {number} [lineWidth = 1] The default width of a line
        * @param {string} [axisWidth = 2] The default width of the axes
        */
        function Styles(stroke, fill, point, line, equation, axes, minorGridLines, majorGridLines, pointWidth, lineWidth, axisWidth) {
            if (typeof stroke === "undefined") { stroke = "black"; }
            if (typeof fill === "undefined") { fill = "black"; }
            if (typeof point === "undefined") { point = "black"; }
            if (typeof line === "undefined") { line = "black"; }
            if (typeof equation === "undefined") { equation = "red"; }
            if (typeof axes === "undefined") { axes = "black"; }
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
    GraphPaper.Styles = Styles;
})(GraphPaper || (GraphPaper = {}));
/**
* @namespace GraphPaper
*/
var GraphPaper;
(function (GraphPaper) {
    var Scale = (function () {
        /**
        * Sets up the tick scaling for the graph
        *
        * @class GraphPaper.Scale
        * @classdesc This is the class used to determine the spacing between graph ticks
        *
        * @param {GraphPaper.Graph} graph The graph that you want to be scaled
        */
        function Scale(graph) {
            this.graph = graph;
            this.scale();
        }
        /**
        * This creates the nice intervals and mins and maxes for the graph.
        * Adapted from <a href = "http://www.amazon.com/Graphics-Gems-Andrew-S-Glassner/dp/0122861663">Graphics Gems</a>
        *
        * @method GraphPaper.Scale#scale
        */
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

        /**
        * This rounds numbers to the format 1*10^n, 2*10^n, or 5*10^n
        * @method GraphPaper.Scale#makeNice
        *
        * @param {number} num The number to make nice
        * @param {round} boolean Whether to round up or down
        *
        *
        * @returns {Array<number>} The zeroth element is the base 10 mantissa and the second one is the exponent.
        * For example [5, 2] would be 5*10^2
        */
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
    GraphPaper.Scale = Scale;
})(GraphPaper || (GraphPaper = {}));
/// <reference path="Point.ts" />
var GraphPaper;
(function (GraphPaper) {
    /**
    * @namespace GraphPaper.Shapes
    */
    (function (Shapes) {
        var Line = (function () {
            /**
            * Constructor from two points to create a new line
            *
            * @class GraphPaper.Shapes.Line
            * @classdesc This is a class that defines and draws a line on the graph
            *
            * @param {Point} point1 The first point of the line
            * @param {Point} point2 The second point of the line
            * @param {string} [color = "black"] The color of the loine
            * @param {number} [width = 1] The width of the line
            */
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
            /**
            * @method GraphPaper.Shapes.Line#draw
            * @see GraphPaper.Drawable#draw
            */
            Line.prototype.draw = function (graph) {
                graph.context.strokeStyle = this.color;
                graph.context.lineWidth = this.width;

                var pt1 = this.point1.toCanvas(graph);
                var pt2 = this.point2.toCanvas(graph);

                //Make an exception for drawing vertical and horizontal lines due to pixel rounding
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
                /**
                * The first point of the line
                * @member GraphPaper.Shapes.Line#point1
                */
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
                /**
                * The second point of the line
                * @member GraphPaper.Shapes.Line#point2
                */
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
                /**
                * The color of the point
                * @member GraphPaper.Shapes.Line#color
                */
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
                /**
                * The width of the line
                * @member GraphPaper.Shapes.Line#width
                */
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
        Shapes.Line = Line;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));
/**
* @namespace GraphPaper.Shapes
*/
var GraphPaper;
(function (GraphPaper) {
    (function (Shapes) {
        var Label = (function () {
            /**
            * Constructor for a new text field on a graph
            *
            * @class GraphPaper.Shapes.Label
            * @classdesc Creates a new text box on the graph
            *
            * @param {Point} point The point to put the text at
            * @param {string} text The text to display
            * @param {string} [align = "start"] <a href = "http://msdn.microsoft.com/en-us/library/ie/ff974919(v=vs.85).aspx">Text align</a>
            * @param {boolean} [centered = false] If true, it will attempt to put the point at the center of the text.
            * Otherwise, it will put it where it would be for the given alignment
            * @param {string} [color = "black"] The color of the text
            * @param {string} [font = "10px sans-serif"] The font of the text. Default is the canvas default
            */
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
            /**
            * @method GraphPaper.Shapes.Label#draw
            * @see GraphPaper.Drawable#draw
            */
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
                /**
                * The point where the text is drawn
                * @member GraphPaper.Shapes.Label#point
                */
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
                /**
                * The text to draw
                * @member GraphPaper.Shapes.Label#text
                */
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
                /**
                * The text alignment
                * @member GraphPaper.Shapes.Label#align
                */
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
                /**
                * Whether the text is centered around the point or not
                * @member GraphPaper.Shapes.Label#centered
                */
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
                /**
                * The color of the text
                * @member GraphPaper.Shapes.Label#color
                */
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
                /**
                * The font the text is drawn with
                * @member GraphPaper.Shapes.Label#font
                */
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
        Shapes.Label = Label;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));
/// <reference path="Point.ts" />
var GraphPaper;
(function (GraphPaper) {
    /**
    * @namespace GraphPaper.Shapes
    */
    (function (Shapes) {
        var Line = GraphPaper.Shapes.Line;

        var Expression = (function () {
            /**
            * This constructs an equation to be graphed
            *
            * @class GraphPaper.Shapes.Expression
            * @classdesc This provides an equation which is compiled from a string for drawing
            *
            * @param {string} eqn The equation in string format
            * @param {string} [color = "red"] The color of the equation
            */
            function Expression(eqn, color) {
                if (typeof color === "undefined") { color = "red"; }
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
            Expression.prototype.draw = function (graph) {
                for (var x = graph.xMin; x < graph.xMax; x += graph.xResolution) {
                    var lastX = x - (graph.xResolution);
                    var lastY = this.f(lastX);

                    var line = new Line(new GraphPaper.Shapes.Point(lastX, lastY), new GraphPaper.Shapes.Point(x, this.f(x)), this.color);
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
                /**
                * This is the equation represented as a math string.
                * @member GraphPaper.Shapes.Expression#eqn
                */
                get: function () {
                    return this._eqn;
                },
                set: function (v) {
                    this.f = new Equation(v).compile();
                    this.updateGraphs();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Expression.prototype, "color", {
                /**
                * The color of the equation
                * @member GraphPaper.Shapes.Expression#color
                */
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
        Shapes.Expression = Expression;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));
/// <reference path="Line.ts" />
/// <reference path="Label.ts" />
/// <reference path="Expression.ts" />
var GraphPaper;
(function (GraphPaper) {
    /**
    * This provides all of the implementations of {GraphPaper.Drawable}
    * @namespace GraphPaper.Shapes
    */
    (function (Shapes) {
        var Point = (function () {
            /**
            * Constructor for a new point on a graph
            *
            * @class GraphPaper.Shapes.Point
            * @classdesc Provides a point with a coordinate system centered at 0, 0
            *
            * @param {number} x The x coordinate of the point in rectangular notation
            * @param {number} y The y coordinate of the point in rectangular notation
            * @param {string} [color = "black"] The color of the point
            * @param {number} [width = 3] The radius of the point
            */
            function Point(x, y, color, width) {
                if (typeof color === "undefined") { color = "black"; }
                if (typeof width === "undefined") { width = 3; }
                this._x = x;
                this._y = y;

                this._color = color;
                this._width = width;

                this._graphs = [];
            }
            /**
            * @method GraphPaper.Shapes.Point#draw
            * @see GraphPaper.Drawable#draw
            */
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

            /**
            * This method converts the traditional graphing coordinate system.
            * @example
            * //returns {x: 250, y: 250}
            * var canvas = document.getElementById("canvas");
            * canvas.width = 500;
            * canvas.height = 500;
            * var graph = new GraphPaper.Graph(canvas)
            * new Point(0, 0).toCanvas(graph);
            *
            * @method GraphPaper.Shapes.Point#toCanvas
            *
            * @param {GraphPaper.graph} graph The graph that the points need to be converted on
            * @returns {Object} The points on the graph translated to the normal canvas coordinates
            * @returns {number} point.x: The x coordinate
            * @returns {number} point.y: The y coordinate
            */
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
                /**
                * The x coordinate in rectangular notation
                * @member GraphPaper.Shapes.Point#x
                */
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
                /**
                * The y coordinate in rectangular notation
                * @member GraphPaper.Shapes.Point#y
                */
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
                /**
                * The color of the point
                * @member GraphPaper.Shapes.Point#color
                */
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
                /**
                * The radius of the point
                * @member GraphPaper.Shapes.Point#width
                */
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
        Shapes.Point = Point;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));
/// <reference path="Drawables/Point.ts" />
/// <reference path="Drawables/Line.ts" />
/// <reference path="Drawables/Label.ts" />
/// <reference path="Drawables/Expression.ts" />
/// <reference path="Styles.ts" />
/// <reference path="Scale.ts" />
/// <reference path="Drawable.ts" />
/**
* The namespace for the graph which encapsulates the graph object as well as all of the shapes
* @namespace GraphPaper
*/
var GraphPaper;
(function (GraphPaper) {
    

    var Scale = GraphPaper.Scale;

    var Point = GraphPaper.Shapes.Point;
    var Line = GraphPaper.Shapes.Line;
    var Label = GraphPaper.Shapes.Label;
    var Expression = GraphPaper.Shapes.Expression;

    var Graph = (function () {
        /**
        * This is the main class GraphPaper.Graph. It is used to initialize a new graph. By default a graph initializes
        * with a window of [-10, 10] by [-10, 10].
        *
        * @class GraphPaper.Graph
        * @classdesc GraphPaper.Graph is the starting point of the library.
        *
        * @param canvas {HTMLCanvasElement} The canvas to draw on
        * @param {number} [xMin = -10] The minimum of the x-axis
        * @param {number} [xMax = 10] The maximum of the x-axis
        * @param {number} [yMin = 10] The minimum of the y-axis
        * @param {number} [yMax = 10] The maximum of the y-axis
        * @param {boolean} [axes = true] Whether or not to display axes on the graph
        * @param {boolean} [gridlines = true] Whether or not to display gridlines on the graph
        * @param {boolean} [tabs = true] Whether or not to display tabs on the graph
        * @param {Styles} [style = The default styles] The styles of different objects on the graph
        */
        function Graph(canvas, xMin, xMax, yMin, yMax, axes, gridlines, tabs, style) {
            if (typeof xMin === "undefined") { xMin = -10; }
            if (typeof xMax === "undefined") { xMax = 10; }
            if (typeof yMin === "undefined") { yMin = -10; }
            if (typeof yMax === "undefined") { yMax = 10; }
            if (typeof axes === "undefined") { axes = true; }
            if (typeof gridlines === "undefined") { gridlines = true; }
            if (typeof tabs === "undefined") { tabs = true; }
            if (typeof style === "undefined") { style = new GraphPaper.Styles(); }
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

            this.interpolate();

            this.update();
        }
        /**
        * Sets up the event handler for tracing functions.
        * @private
        * @method GraphPaper.Graph#interpolate
        *
        */
        Graph.prototype.interpolate = function () {
            var graph = this;

            var canvas = this.context.canvas;

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

        /**
        * This adds a shape to the graph that stays whenever the graph is redrawn
        * @method GraphPaper.Graph#add
        * @param {GraphPaper.Drawable} shape The shape that needs to be permanently added
        */
        Graph.prototype.add = function (shape) {
            this._shapes.push(shape);
            shape.add(this);
            if (shape instanceof Expression) {
                this.trace = shape;
            }
            this.update();
        };

        /**
        * This removes shapes from the graph
        * @method GraphPaper.Graph#remove
        * @param {GraphPaper.Drawable} shape The shape to be removed
        */
        Graph.prototype.remove = function (shape) {
            for (var i = this._shapes.length - 1; i >= 0; i--) {
                if (this._shapes[i].equals(shape)) {
                    this._shapes.splice(i, 1);
                }
            }

            shape.remove(this);

            this.update();
        };

        /**
        *
        * This redraws everything on the graph
        * @method GraphPaper.Graph#update
        *
        * @param {boolean} [recalculate = true] If this is true, the graph will recalculate the resolution and scales
        */
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

        /**
        * This method initializes the event listener for dragging
        * @method GraphPaper.Graph#drag
        */
        Graph.prototype.drag = function () {
            var context = this._context;
            var graph = this;
            var canvas = context.canvas;
            var offset = $(canvas).offset();
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

        /**
        * This initializes the event listener for zooming
        * @method GraphPaper.Graph#zoom
        */
        Graph.prototype.zoom = function () {
            var graph = this;
            var canvas = this.context.canvas;

            $(canvas).mousewheel(function (e) {
                e.preventDefault();
                e.stopPropagation();

                var parentOffset = $(this).parent().offset();

                var x = e.pageX - parentOffset.left;
                var y = e.pageY - parentOffset.top;

                var delta = e.deltaY * e.deltaFactor;
                var factor = 1 + delta / 1000;

                var origin = new Point(0, 0).toCanvas(graph);

                var xOffset = (x - origin.x) * graph.xResolution;
                var yOffset = (y - origin.y) * graph.yResolution;

                var xMin = (graph.xZoom) ? Number(((graph.xMin - xOffset) * factor + xOffset).toPrecision(21)) : graph.xMin;
                var xMax = (graph.xZoom) ? Number(((graph.xMax - xOffset) * factor + xOffset).toPrecision(21)) : graph.xMax;

                var yMin = (graph.yZoom) ? Number(((graph.yMin + yOffset) * factor - yOffset).toPrecision(21)) : graph.yMin;
                var yMax = (graph.yZoom) ? Number(((graph.yMax + yOffset) * factor - yOffset).toPrecision(21)) : graph.yMax;

                graph.setWindow(xMin, xMax, yMin, yMax);
            });
        };

        /**
        * This draws the axes according to the style given
        * @method GraphPaper.Graph#drawAxes
        */
        Graph.prototype.drawAxes = function () {
            var xAxis = new Line(new Point(this._xMin, 0), new Point(this._xMax, 0), this.style.axes, this.style.axisWidth);
            var yAxis = new Line(new Point(0, this._yMin), new Point(0, this._yMax), this.style.axes, this.style.axisWidth);

            xAxis.draw(this);
            yAxis.draw(this);
        };

        /**
        * This draws the gridlines according to the style given
        * @method GraphPaper.Graph#drawGridLines
        */
        Graph.prototype.drawGridlines = function () {
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

        /**
        * This draws the ticks on the axes
        * @method GraphPaper.Graph#drawTabs
        */
        Graph.prototype.drawTabs = function () {
            this._context.strokeStyle = this.style.axes;

            var majorTabWidth = 8 * this.xResolution;
            var majorTabHeight = 8 * this.yResolution;

            var minorTabWidth = 4 * this.xResolution;
            var minorTabHeight = 4 * this.yResolution;

            this.style.lineWidth = 1;

            var line;

            var x;
            var y;

            //Minor tabs
            var xScale = this._scale.minorXScale;
            var yScale = this._scale.minorYScale;

            for (x = this._scale.minorXMin; x < this._scale.minorXMax; x += xScale) {
                line = new Line(new Point(x, -minorTabHeight), new Point(x, minorTabHeight), this.style.axes);
                line.draw(this);
            }

            for (y = this._scale.minorYMin; y < this._scale.minorYMax; y += yScale) {
                line = new Line(new Point(-minorTabWidth, y), new Point(minorTabWidth, y), this.style.axes);
                line.draw(this);
            }

            //Major tabs
            xScale = this._scale.majorXScale;
            yScale = this._scale.majorYScale;

            for (x = this._scale.majorXMin; x < this._scale.majorXMax; x += xScale) {
                line = new Line(new Point(x, -majorTabHeight), new Point(x, majorTabHeight), this.style.axes);
                line.draw(this);
            }

            for (y = this._scale.majorYMin; y < this._scale.majorYMax; y += yScale) {
                line = new Line(new Point(-majorTabWidth, y), new Point(majorTabWidth, y), this.style.axes);
                line.draw(this);
            }
        };

        /**
        * This draws the ticks on the axes
        * @method GraphPaper.Graph#drawLabels
        */
        Graph.prototype.drawLabels = function () {
            var xScale = this._scale.majorXScale;
            var point;
            var pixels = 20;
            var i;
            var message;

            for (i = this._scale.majorXMin; i < this._scale.majorXMax; i += xScale) {
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

                    message = parseFloat(i.toPrecision(8)).toString();
                    if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                        message = i.toExponential();
                    }

                    new Label(point, message, "start", true).draw(this);
                }
            }

            var yScale = this._scale.majorYScale;

            this.context.textAlign = "end";

            pixels = 15;

            for (i = this._scale.majorYMin; i < this._scale.majorYMax; i += yScale) {
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

                    message = parseFloat(i.toPrecision(8)).toString();
                    if (Math.log(Math.abs(i)) / Math.log(10) > 5) {
                        message = i.toExponential();
                    }

                    new Label(point, message, align).draw(this);
                }
            }
        };

        Object.defineProperty(Graph.prototype, "xMin", {
            /**
            * This is the minimum x coordinate of the graph
            * @member {number} GraphPaper.Graph#xMin
            */
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
            /**
            * This is the maximum x coordinate of the graph
            * @member {number} GraphPaper.Graph#xMax
            */
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
            /**
            * This is the minimum y coordinate of the graph
            * @member {number} GraphPaper.Graph#yMin
            */
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
            /**
            * This is the maxmimum y coordinate of the graph
            * @member {number} GraphPaper.Graph#yMax
            */
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
            /**
            * This is the length of the x-axis, or xMax - xMin
            * @member {number} GraphPaper.Graph#xLength
            */
            get: function () {
                return this._xLength;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Graph.prototype, "yLength", {
            /**
            * This is the length of the y-axis, or yMax - yMin
            * @member {number} GraphPaper.Graph#yLength
            */
            get: function () {
                return this._yLength;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Graph.prototype, "majorXScale", {
            /**
            * This is how far apart the major x gridlines are from each other. It is calculated in {@link GraphPaper.Scale}
            * @member {number} GraphPaper.Graph#majorXScale
            */
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
            /**
            * This is how far apart the major y gridlines are form each other. It is calculated in {@link GraphPaper.Scale}
            * @member {number} GraphPaper.Graph#majorYScale
            */
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
            /**
            * This is how far apart the minor y gridlines are from each other. It is calculated in {@link GraphPaper.Scale}
            * @member {number} GraphPaper.Graph#minorYScale
            */
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
            /**
            * This is the maximum number of major gridlines in the graph. Changing this will change the tabs and gridlines
            * @member {number} GraphPaper.Graph#maxTicks
            */
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
            /**
            * This is the width of the canvas
            * @member {number} GraphPaper.Graph#width
            */
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Graph.prototype, "height", {
            /**
            * This is the height of the canvas
            * @member {number} GraphPaper.Graph#height
            */
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Graph.prototype, "xResolution", {
            /**
            * This is used in converting to and from pixels and coordinate length on the x-axis
            * @member {number} GraphPaper.Graph#xResolution
            */
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
            /**
            * This is used in converting to and from pixels and coordinate lengths on the y-axis
            * @member {number} GraphPaper.Graph#yResolution
            */
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
    GraphPaper.Graph = Graph;
})(GraphPaper || (GraphPaper = {}));

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
    GraphPaper.Scale = Scale;
})(GraphPaper || (GraphPaper = {}));

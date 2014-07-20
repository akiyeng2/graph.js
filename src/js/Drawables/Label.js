/**
* @namespace GraphPaper
*/
var GraphPaper;
(function (GraphPaper) {
    /**
    * @namespace GraphPaper.Shapes
    */
    (function (Shapes) {
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
        Shapes.Label = Label;
    })(GraphPaper.Shapes || (GraphPaper.Shapes = {}));
    var Shapes = GraphPaper.Shapes;
})(GraphPaper || (GraphPaper = {}));

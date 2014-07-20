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

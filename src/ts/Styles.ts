/// <reference path="Graph.ts" />

/**
 * @namespace GraphPaper
 */
module GraphPaper {

    export class Styles {
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
        constructor(public stroke: string = "black", public fill: string = "black", public point: string = "black",
                    public line: string = "black", public equation: string = "red", public axes: string = "black",
                    public minorGridLines: string = "#E6E6E6", public majorGridLines: string = "lightgrey",
                    public pointWidth: number = 3, public lineWidth: number = 1, public axisWidth: number = 2) {


        }
    }
}


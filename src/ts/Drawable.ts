/// <reference path="Drawables/Point.ts" />
/// <reference path="Drawables/Line.ts" />
/// <reference path="Drawables/Label.ts" />
/// <reference path="Drawables/Expression.ts" />
/// <reference path="Drawables/Plot.ts" />

/**
 * @namespace GraphPaper
 */

module GraphPaper {

    /**
     * Drawable
     * @interface
     * @class GraphPaper.Drawable
     * @classdesc This is drawable
     */
	export interface Drawable {


        /**
         * Draws itself on the graph specified. Use this directly when you want to draw something that disappears with
         * the next graph update. For more permanent additions, use GraphPaper.Graph#add
         * @abstract
         * @method GraphPaper.Drawable#draw
         * @param {GraphPaper.Graph} graph The graph to draw on
         */
		draw(graph: Graph): void;


        /**
         * Adds a graph to the list of graphs. Used to automatically update when properties are set
         * @abstract
         * @method GraphPaper.Drawable#add
         * @param {GraphPaper.Graph} graph The graph to add
         */
		add(graph: Graph): void;

        /**
         * Removes a graph from the list of graphs
         * @abstract
         * @method GraphPaper.Drawable#remove
         * @param {GraphPaper.Graph} graph The graph to remove
         */
		remove(graph: Graph): void;


		equals(other: Drawable): boolean;

		toString(): string;

	}

}

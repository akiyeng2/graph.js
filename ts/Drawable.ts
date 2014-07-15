/// <reference path="Drawables/Point.ts" />
/// <reference path="Drawables/Line.ts" />
/// <reference path="Drawables/Label.ts" />
/// <reference path="Drawables/Equation.ts" />

interface Drawable {



	draw(graph: Graph): void;
	add(graph: Graph): void;
	remove(graph: Graph): void;
	equals(other: Drawable): boolean;
	toString(): string;

}

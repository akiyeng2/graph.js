/// <reference path="Graph.ts" />
/*global $:false */


var canvas: any = document.getElementById("graph");
canvas.width = 500;
canvas.height = 500;
var graph = new Graph(canvas, -10, 10, -10, 10);

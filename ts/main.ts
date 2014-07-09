/// <reference path="Graph.ts" />
/*global $:false */


var canvas: any = document.getElementById("graph");
canvas.width = 600;
canvas.height = 600;
var graph = new Graph(canvas, -10, 10, -10, 10);

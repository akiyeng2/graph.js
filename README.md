graph.js
========

Graph.js is a Javascript library for graphing functions, lines, points and more. It is written in Microsoft's Typescript but is compiled to ECMAScript 5 Javascript so it can be used in browsers or [nodewebkit](https://github.com/rogerwang/node-webkit).

#Features

+ Includes a built-in equation parser for ease of entering equatiosn
+ Adding elements to the graph is fast and simple
+ Provides a graph with intervals at round numbers
+ Graph interface is easy to manipulate to achieve different looks
+ Allows for dragging and zooming with mouse movements
+ Tracing enabled within the graph to find values at specific points

#Getting started

Download the zip file or type `$ git clone https://github.com/scrblnrd3/graph.js.git` into the command line. Run `bower install` to install jQuery and jQuery mousewheel or include them from your favorite CDN in a webpage.

#Dependencies

+ [jQuery](https://github.com/jquery/jquery)
+ [jQuery-mousewheel](https://github.com/brandonaaron/jquery-mousewheel)
+ [Fraction.js](https://github.com/ekg/fraction.js)

#Usage

To use this, create an HTML page with a `<canvas>` tag, and specify the dimensions and provide an id. In your Javascript, initialize a new Graph object by

```javascript
var canvas = document.getElementById('canvas');
var graph = new Graph(canvas); //Specify options here such as window and colors
```

Adding elements to the graph is easy. So far you can add points, lines, and mathematical functions

```javascript
var point1 = new Point(1, 3);
var point2 = new Point(5, 2);

var line = new Line(point1, point2);
graph.add(line);

var fn = new Expression("sin(2x)cos(x)");
graph.add(fn);
```

To remove elements from the graph, enter `graph.remove(element)`

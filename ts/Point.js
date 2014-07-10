/*global $:false */
var Point = (function () {
    //  var newX=x*(this.settings.width/this.settings.xlength),newY=-y*(this.settings.height/this.settings.ylength);
    function Point(x, y, graph) {
        var originX = -graph.xMin * graph.width / graph.xLength;
        var originY = graph.height + graph.yMin * graph.height / graph.yLength;

        this.x = originX + x * (graph.width / graph.xLength);
        this.y = originY - y * (graph.height / graph.yLength);
    }
    return Point;
})();

/*global $:false */
class Point {
    x: number;
    y: number;
        
    private gridX: number;
    private gridY: number;
    //  var newX=x*(this.settings.width/this.settings.xlength),newY=-y*(this.settings.height/this.settings.ylength);

    constructor(x: number, y: number, graph: Graph) {
        var originX = -graph.xMin * graph.width / graph.xLength;
        var originY = graph.height + graph.yMin * graph.height / graph.yLength;



        this.x = originX + x * (graph.width / graph.xLength);
        this.y = originY - y * (graph.height / graph.yLength);

           
    }
    
    
}
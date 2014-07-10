// /*global $:false */
// class Point {
//     x: number;
//     y: number;

//     private gridX: number;
//     private gridY: number;
//     //  var newX=x*(this.settings.width/this.settings.xlength),newY=-y*(this.settings.height/this.settings.ylength);

//     constructor(x: number, y: number, graph: Graph) {
//         var originX = -graph.xMin * graph.width / graph.xLength;
//         var originY = graph.height + graph.yMin * graph.height / graph.yLength;



//         this.x = originX + x * (graph.width / graph.xLength);
//         this.y = originY - y * (graph.height / graph.yLength);


//     }


// }


class Point implements Drawable {
    x: number;
    y: number;

    private _graphX: number;
    private _graphY: number;

    constructor(x: number, y: number, graph: Graph) {
        var originX = -graph.xMin * graph.width / graph.xLength;
        var originY = graph.height + graph.yMin * graph.height / graph.yLength;

        this.x = originX + x * (graph.width / graph.xLength);
        this.y = originY - y * (graph.height / graph.yLength);

        this._graphX = x;
        this._graphY = y;

    }

    public get graphX(): number {
        return this._graphX;
    }

    public get graphy(): number {
        return this._graphY;
    }
}
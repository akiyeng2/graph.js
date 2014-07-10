var Styles = (function () {
    function Styles(stroke, fill, point, line, equation, axes, minorGridLines, majorGridLines, pointWidth, lineWidth, axisWidth) {
        if (typeof stroke === "undefined") { stroke = "black"; }
        if (typeof fill === "undefined") { fill = "black"; }
        if (typeof point === "undefined") { point = "black"; }
        if (typeof line === "undefined") { line = "black"; }
        if (typeof equation === "undefined") { equation = "darkblue"; }
        if (typeof axes === "undefined") { axes = "#2363636"; }
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

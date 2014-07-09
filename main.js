/*global window,Graph,ctx,console,document*/
window.Graph=function (ctx,params){
	"use strict"
	this.ctx=ctx;
	this.settings=
	{
		xmin: ((params.xmin===undefined)?-10:params.xmin),
		xmax: ((params.xmax===undefined)?10:params.xmax),
		ymin: ((params.ymin===undefined)?-10:params.ymin),
		ymax: ((params.xmax===undefined)?10:params.ymax),
		gridlines: ((params.gridlines===undefined)?false:true),
		width:ctx.canvas.width,
		height:ctx.canvas.height,
		axes:((params.axes===undefined)?true:params.axes)
	};
	this.ctx.setTransform(1,0,0,1,0,0);

	this.ctx.save();

	this.settings.xscale=((params.xscale===undefined)?((this.settings.xmax-this.settings.xmin)/20):params.xscale);
	this.settings.yscale=((params.yscale===undefined)?((this.settings.ymax-this.settings.ymin)/20):params.yscale);
	this.settings.xlength=this.settings.xmax-this.settings.xmin;
	this.settings.ylength=this.settings.ymax-this.settings.ymin;
	this.zero();
	if(this.settings.gridlines){
		this.gridlines();
	}else{
		this.tabs();
	}

	this.axes();

};
Graph.prototype.reset=function(){
	"use strict";
	var g=new Graph(this.ctx,{});
	return g;
};
Graph.prototype.update=function (params){
	"use strict";

	this.settings.xmin=((params.xmin===undefined)?this.settings.xmin:params.xmin);
	this.settings.xmax=((params.xmax===undefined)?this.settings.xmax:params.xmax);
	this.settings.ymin=((params.ymin===undefined)?this.settings.ymin:params.ymin);
	this.settings.ymax=((params.xmax===undefined)?this.settings.ymax:params.ymax);
	this.settings.gridlines=((params.gridlines===undefined)?this.settings.gridlines:params.gridlines);
	this.settings.width=ctx.canvas.width;
	this.settings.height=ctx.canvas.height;
	this.settings.axes=((params.axes===undefined)?true:params.axes);
	this.ctx.setTransform(1,0,0,1,0,0);
	this.ctx.save();
	this.settings.xscale=((params.xscale===undefined)?Math.ceil((this.settings.xmax-this.settings.xmin)/20):params.xscale);
	this.settings.yscale=((params.yscale===undefined)?Math.ceil((this.settings.ymax-this.settings.ymin)/20):params.yscale);
	this.settings.xlength=this.settings.xmax-this.settings.xmin;
	this.settings.ylength=this.settings.ymax-this.settings.ymin;
	this.zero();
	this.ctx.clearRect(this.settings.xmin,this.settings.ymin,this.settings.xlength,this.settings.ylength);
	if(this.settings.gridlines){
		this.gridlines();
	}else{
		this.tabs();
	}

	this.axes();
};
Graph.prototype.zero=function (){
	"use strict";
	var newX,newY;
	this.ctx.setTransform(1,0,0,1,0,0);
	this.ctx.restore();
	this.ctx.translate((-this.settings.xmin*(this.settings.width/this.settings.xlength)),this.settings.height+(this.settings.ymin*(this.settings.height/this.settings.ylength)));
	newX=(this.settings.width/this.settings.xlength);
	newY=-(this.settings.height/this.settings.ylength);

	this.ctx.scale(newX,newY);
	this.ctx.lineWidth=1/(Math.abs(newX)/2);
	console.log((-this.settings.xmin*(this.settings.width/this.settings.xlength)),this.settings.height-(this.settings.ymin*(this.settings.height/this.settings.ylength)));

};
Graph.prototype.axes=function(){
	"use strict";
	this.line(this.settings.xmin,0,this.settings.xmax,0);
	this.line(0,this.settings.ymin,0,this.settings.ymax);

};
Graph.prototype.line=function (x1,y1,x2,y2){
	"use strict";
	this.ctx.beginPath();
//	this.ctx.moveTo(this.convert(x1,y1).x,this.convert(x1,y1).y);
//	this.ctx.lineTo(this.convert(x2,y2).x,this.convert(x2,y2).y);
	this.ctx.moveTo(x1,y1);
	this.ctx.lineTo(x2,y2);
	this.ctx.stroke();
};
Graph.prototype.convert=function (x,y){
	"use strict";
	var newX=x*(this.settings.width/this.settings.xlength),newY=-y*(this.settings.height/this.settings.ylength);
//	console.log(newX,newY);
	return {x:newX,y:newY};
};
Graph.prototype.tabs=function (){

	"use strict";
	var i;
	for(i=this.settings.xmin;i<=this.settings.xmax;i+=this.settings.xscale){
		this.line(i,0.25,i,-0.25);
	}for(i=this.settings.ymin;i<=this.settings.ymax;i+=this.settings.yscale){
		this.line(-0.25,i,0.25,i);
	}
};
Graph.prototype.gridlines=function (){
	"use strict";
	this.ctx.strokeStyle="lightgrey";
	var i;
	for(i=this.settings.xmin;i<=this.settings.xmax;i+=this.settings.xscale){
		if(i!==0){
			this.line(i,this.settings.ymin,i,this.settings.ymax);
		}
	}for(i=this.settings.ymin;i<=this.settings.ymax;i+=this.settings.yscale){
		if(i!==0){
			this.line(this.settings.xmin,i,this.settings.xmax,i);
		}
	}
	this.ctx.strokeStyle="black";
};
var ctx=document.getElementById("graph").getContext("2d");
var graph=new Graph(ctx,{});

class Line{
    constructor(){
        this.points = [];
        this.svgo = this.draw();
    }

    draw(){
        if(this.points.length>=2){
            let polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            polyline.setAttribute("points", this.polyPoints.map(x=>`${x[0]},${x[1]}`).join(" "));
            polyline.setAttribute("stroke", "red");
            polyline.setAttribute("fill", "none");
            return polyline;
        }
    }

    update(){
        this.line.setAttribute("points", this.polyPoints.map(x=>`${x[0]},${x[1]}`).join(" "));
    }
}
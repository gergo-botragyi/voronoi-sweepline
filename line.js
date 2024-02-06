class Line{
    constructor(id, points){
        this.id = id;
        this.points = points;
        this.smallerEnd = false;
        this.biggerEnd = false;
        this.svgo = this.draw();
    }

    draw(){        
        let polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        polyline.setAttribute("points", this.points.map(x=>`${x[0]},${x[1]}`).join(" "));
        polyline.setAttribute("stroke", "red");
        polyline.setAttribute("fill", "none");
        return polyline;
    }

    update(){
        this.svgo.setAttribute("points", this.points.map(x=>`${x[0]},${x[1]}`).join(" "));
    }
}
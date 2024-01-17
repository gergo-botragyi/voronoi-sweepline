class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.svgo = this.createSvg();
    }

    createSvg(){
        let svgobject = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        svgobject.setAttribute("cx", this.x);
        svgobject.setAttribute("cy", this.y);
        svgobject.setAttribute("r", "5");
        svgobject.setAttribute("stroke", "black");
        svgobject.setAttribute("fill", "black");
        return svgobject;
    }
}
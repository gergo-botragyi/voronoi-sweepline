class SweepLine{
    constructor(x){
        this.x = x;
        this.svgo = this.makeSvg();
    }
    
    makeSvg(){
        let svgobject = document.createElementNS("http://www.w3.org/2000/svg", "line");
        svgobject.setAttribute('x1', this.x);
        svgobject.setAttribute('y1', 0);
        svgobject.setAttribute('x2', this.x);
        svgobject.setAttribute('y2', container.height);
        svgobject.setAttribute('stroke', 'red')
        return svgobject;
    }

    update(){
        if(this.x+2<=container.width){
            this.x += 2;
            this.svgo.setAttribute('x1', this.x);
            this.svgo.setAttribute('x2', this.x);
            console.log("line updated")
        }
    }
}
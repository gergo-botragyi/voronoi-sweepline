class SweepLine{
    constructor(y){
        this.y = y;
        this.ended = false;
        this.svgo = this.makeSvg();
    }
    
    makeSvg(){
        let svgobject = document.createElementNS("http://www.w3.org/2000/svg", "line");
        svgobject.setAttribute('x1', 0);
        svgobject.setAttribute('y1', this.y);
        svgobject.setAttribute('x2', container.width);
        svgobject.setAttribute('y2', this.y);
        svgobject.setAttribute('stroke', 'red')
        return svgobject;
    }

    update(){
        if(this.y+1<=container.height*2.5){
            this.y += 1;
            this.svgo.setAttribute('y1', this.y);
            this.svgo.setAttribute('y2', this.y);
        }else{
            this.ended = true;
        }
    }
}
class Parabola{
    constructor(f, p){
        this.f = f;
        this.p = p;
        this.x1;
        this.x2;
        this.svgo = this.draw();
    }

    calcPoints(){
        let a = -1 / (2*this.p)
        let b = -1*a*2*this.f.x;
        let c = a*(this.f.x**2)+this.f.y
        this.x1 = (-b+Math.sqrt(b**2 - 4*a*c))/(2*a);
        this.x2 = (-b-Math.sqrt(b**2 - 4*a*c))/(2*a);
    }

    draw(){
        this.calcPoints();        
        let bezier = document.createElementNS("http://www.w3.org/2000/svg", "path");
        bezier.setAttribute('d', `M ${this.x1} 0 Q ${this.f.x} ${this.f.y*2} ${this.x2} 0`);
        bezier.setAttribute('stroke', "black");
        bezier.setAttribute("fill", "transparent");
        return bezier;
    }

    update(){
        this.p = (sweepline.y-this.f.y)*2;
        this.calcPoints();
        this.svgo.setAttribute('d', `M ${this.x1} 0 Q ${this.f.x} ${this.f.y*2+this.p/2} ${this.x2} 0`);
    }
}
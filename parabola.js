class Parabola{
    constructor(f, p){
        this.f = f;        
        this.p = p;
        this.t = this.f.y*2+this.p;
        this.a;
        this.b;
        this.c;
        this.x1;
        this.x2;
        this.svgo = this.draw();
    }

    calcPoints(){
        this.a = -1 / (2*this.p)
        this.b = -1*this.a*2*this.f.x;
        this.c = this.a*(this.f.x**2)+this.t
        this.x1 = (-this.b+Math.sqrt(this.b**2 - 4*this.a*this.c))/(2*this.a);
        this.x2 = (-this.b-Math.sqrt(this.b**2 - 4*this.a*this.c))/(2*this.a);
    }

    draw(){
        this.calcPoints();        
        let bezier = document.createElementNS("http://www.w3.org/2000/svg", "path");
        bezier.setAttribute('d', `M ${this.x1} 0 Q ${this.f.x} ${this.t} ${this.x2} 0`);
        bezier.setAttribute('stroke', "black");
        bezier.setAttribute("fill", "transparent");
        return bezier;
    }

    update(){        
        this.p = sweepline.y-this.f.y;
        this.t = this.f.y*2+this.p
        //console.log(sweepline.y+" "+this.f.y)
        console.log(this.p)
        this.calcPoints();
        this.svgo.setAttribute('d', `M ${this.x1} 0 Q ${this.f.x} ${this.t} ${this.x2} 0`);
        console.log(this.a+" "+this.b+" "+this.c)
    }
}
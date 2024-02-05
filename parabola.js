class Parabola{
    constructor(f, p){
        this.f = f;        
        this.p = p;
        this.a;
        this.b;
        this.c;
        this.x1;
        this.x2;
        this.svgo = this.draw();
    }

    calcPoints(){        
        this.a = this.a == undefined ? (-1 / (2*this.p))*30 : -1 / (2*this.p)
        this.b = -1*this.a*2*this.f.x;
        this.c = this.a*(this.f.x**2)+this.f.y+this.p/2
        this.x1 = (-this.b+Math.sqrt(this.b**2 - 4*this.a*this.c))/(2*this.a);
        this.x2 = (-this.b-Math.sqrt(this.b**2 - 4*this.a*this.c))/(2*this.a);
    }

    draw(){
        this.calcPoints();        
        let bezier = document.createElementNS("http://www.w3.org/2000/svg", "path");
        bezier.setAttribute('d', `M ${this.x1} 0 Q ${this.f.x} ${this.f.y*2+this.p} ${this.x2} 0`);
        bezier.setAttribute('stroke', "black");
        bezier.setAttribute("fill", "transparent");
        return bezier;
    }

    update(){        
        this.p = sweepline.y-this.f.y;
        this.calcPoints();
        this.svgo.setAttribute('d', `M ${this.x1} 0 Q ${this.f.x} ${this.f.y*2+this.p} ${this.x2} 0`);
    }    

    distancesqr(x, y){
        return ((x-this.f.x)**2 + (y-(this.f.y))**2);
    }
}
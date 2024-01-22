class Parabola{
    constructor(f, p){
        this.f = f;
        this.p = p;
        this.svgo = this.draw();
    }

    plot(p, u, v, {from, to}){
        let res = [];

        for(let x = from; x < to; x+=2){
            const y = 1 / (2*p) * (x-u)**2 + v;
            res.push([x, y])
        }
    }
    
    draw(){
        const points = plot(p, point.x, point.y, {})        
    }
}
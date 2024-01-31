let svgcanvas = document.getElementById("svgcanvas");
svgcanvas.addEventListener("mousedown", placePoint, false);
const container = svgcanvas.getBoundingClientRect();
let globalID;
let borders = document.getElementById("borders");

let started = false;
let points = [];
let parabolaIndexes = [];
let parabolaCon = [];
let polyPoints = [];
let i = 0;
let sweepline = new SweepLine(0);
svgcanvas.appendChild(sweepline.svgo);

function placePoint(evt){
    let cursorpt = cursorPoint(evt)
    let point = new Point(cursorpt.x,cursorpt.y, i++);
    svgcanvas.appendChild(point.svgo);
    points.push(point);
}

function cursorPoint(evt){
    let pt = svgcanvas.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svgcanvas.getScreenCTM().inverse());
}

function update(){
    if(started && sweepline.ended == false){
        started = true;
        sweepline.update();
        for (const par of parabolaCon) {
            par.update();
        }
        for (const point of points) {
            if(sweepline.y-point.y > 1){
                if(!parabolaIndexes.includes(point.i)){
                    let parabola = new Parabola(point, (sweepline.y-point.y));
                    parabolaIndexes.push(point.i);
                    svgcanvas.appendChild(parabola.svgo)
                    parabolaCon.push(parabola);
                }
            }
        }
        for (let i = 0; i < parabolaCon.length-1; i++) {            
            for (let j = i+1; j < parabolaCon.length; j++) {                
                let a = parabolaCon[i].a-parabolaCon[j].a;
                let b = parabolaCon[i].b-parabolaCon[j].b;
                let c = parabolaCon[i].c-parabolaCon[j].c;

                let x1 = (-b+Math.sqrt(b**2 - 4*a*c))/(2*a);
                let y1 = (parabolaCon[i].a*(x1**2)) + (parabolaCon[i].b*x1) + parabolaCon[i].c
                
                if(x1 < container.width && x1>0 && y1<container.height && y1 >0){
                    polyPoints.push([x1,y1])
                }

                let x2 = (-b-Math.sqrt(b**2 - 4*a*c))/(2*a);
                let y2 = (parabolaCon[i].a*(x2**2)) + (parabolaCon[i].b*x2) + parabolaCon[i].c
                
                if(x2 < container.width && x2>0 && y2<container.height && y2 >0){
                    polyPoints.push([x2,y2])
                }                
            }
        }
        borders.setAttribute("points", polyPoints.map(x=>`${x[0]},${x[1]}`).join(" "))
        globalID = requestAnimationFrame(update);
    }
}

let keymap = {};
onkeydown = onkeyup = function(e){
    keymap[e.key] = e.type == 'keydown';
    if(!started){
        if(keymap["s"]){started = true; globalID = this.requestAnimationFrame(update);}
    }
};
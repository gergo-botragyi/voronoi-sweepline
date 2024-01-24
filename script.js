let svgcanvas = document.getElementById("svgcanvas");
svgcanvas.addEventListener("mousedown", placePoint, false);
const container = svgcanvas.getBoundingClientRect();
let globalID;

let started = false;
let points = [];
let parabolaMap = new Map();
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
    if(started){
        started = true;
        sweepline.update();
        for (const point of points) {
            if(sweepline.y-point.y > 1){
                if(!parabolaMap.has(point.i)){
                    let parabola = new Parabola(point, (sweepline.y-point.y)*2);
                    parabolaMap.set(point.i, parabola);
                    svgcanvas.appendChild(parabola.svgo)
                }else{
                    parabolaMap.get(point.i).update();
                }
            }
        }
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
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
let first = true;
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
        makeParabolas();
        intersections();
        borders.setAttribute("points", polyPoints.map(x=>`${x[0]},${x[1]}`).join(" "))
        globalID = requestAnimationFrame(update);
    }
}

function makeParabolas(){
    for (const point of points) {
        if(sweepline.y-point.y > 1){
            if(!parabolaIndexes.includes(point.i)){
                let parabola = new Parabola(point, (sweepline.y-point.y));
                parabolaIndexes.push(point.i);
                svgcanvas.appendChild(parabola.svgo);
                parabolaCon.push(parabola);
            }
        }
    }
}

let ongoing = false;
function intersections(){
    for (let i = 0; i < parabolaCon.length-1; i++) {            
        for (let j = i+1; j < parabolaCon.length; j++) {
            const par1 = parabolaCon[i];
            const par2 = parabolaCon[j];

            let a = par1.a-par2.a;
            let b = par1.b-par2.b;
            let c = par1.c-par2.c;

            let x1 = (-b-Math.sqrt(b**2 - 4*a*c))/(2*a);
            let y1 = (par1.a*(x1**2)) + (par1.b*x1) + par1.c
            
            if(x1 < container.width && x1>0 && y1<container.height && y1 >0){
                let d1 = par1.distancesqr(x1, y1);
                let d2 = par2.distancesqr(x1, y1);

                if(!closerToOthers(d1, d2, i, j, x1, y1)){
                    if(polyPoints.length > 0){
                        let insIndex = closestNeighbour([x1, y1]);
                        polyPoints.splice(insIndex, 0, [x1, y1]);
                    }else{
                        polyPoints.push([x1, y1]);
                    }
                }
            }

            let x2 = (-b+Math.sqrt(b**2 - 4*a*c))/(2*a);
            let y2 = (par1.a*(x2**2)) + (par1.b*x2) + par1.c
            
            if(x2 < container.width && x2>0 && y2<container.height && y2 >0){
                let d12 = par1.distancesqr(x2, y2);
                let d22 = par2.distancesqr(x2, y2);

                if(!closerToOthers(d12, d22, i, j, x2, y2)){
                    if(polyPoints.length > 0){
                        insIndex = closestNeighbour([x2, y2]);
                        polyPoints.splice(insIndex, 0, [x2, y2]);
                    }else{
                        polyPoints.push([x2, y2]);
                    }
                }
            }                
        }
    }
}

function closerToOthers(di, dj, i, j, x, y){
    for (let index = 0; index < parabolaCon.length; index++) {        
        if(index != i && index != j){
            let d = parabolaCon[index].distancesqr(x, y);
            if(d < di && d < dj){
                return true;
            }
        }
    }
    return false;
}

function closestNeighbour([x, y]){
    let minDistance = distancesqr(polyPoints[0], [x,y]);
    let minIndex = 0;
    for (let i = 0; i < polyPoints.length; i++) {
        let currDis = distancesqr(polyPoints[i], [x,y]);
        if(currDis < minDistance){minDistance = currDis; minIndex=i;}
    }
    return minIndex;
}

function distancesqr([x1,y1], [x2, y2]){
    return ((x1-x2)**2 + (y1-y2)**2);
}

let keymap = {};
onkeydown = onkeyup = function(e){
    keymap[e.key] = e.type == 'keydown';
    if(!started){
        if(keymap["s"]){started = true; globalID = this.requestAnimationFrame(update);}
    }
};
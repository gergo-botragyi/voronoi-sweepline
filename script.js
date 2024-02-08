let svgcanvas = document.getElementById("svgcanvas");
svgcanvas.addEventListener("mousedown", placePoint, false);
let container = svgcanvas.getBoundingClientRect();
let globalID;
let borders = document.getElementById("borders");

let started = false;
let points = [];
let parabolaIndexes = [];
let parabolaCon = [];
let linePoints = new Map();
let lines = [];

let sweepline = new SweepLine(0);
svgcanvas.appendChild(sweepline.svgo);

let i = 0;
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
    container = svgcanvas.getBoundingClientRect();
    if(started && sweepline.ended == false){
        started = true;
        sweepline.update();
        for (const par of parabolaCon) {
            par.update();
        }
        makeParabolas();
        intersections();
        drawLines();

        globalID = requestAnimationFrame(update);
    }    
}

function makeParabolas(){
    if(parabolaIndexes.length == points.length){
        return;
    }
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

function intersections(){
    for (let i = 0; i < parabolaCon.length-1; i++) {            
        for (let j = i+1; j < parabolaCon.length; j++) {
            const par1 = parabolaCon[i];
            const par2 = parabolaCon[j];

            let a = par1.a-par2.a;
            let b = par1.b-par2.b;
            let c = par1.c-par2.c;

            let index = lines.findIndex(x=>x.id==`${i}${j}`);
            if(index != -1){
                if(lines[index].smallerEnd && lines[index].biggerEnd){
                    continue;
                }
            }

            let x1 = (-b-Math.sqrt(b**2 - 4*a*c))/(2*a);
            let y1 = (par1.a*(x1**2)) + (par1.b*x1) + par1.c
            
            if(x1 < container.width && x1>0 && y1<container.height && y1 >0){
                let d1 = par1.distancesqr(x1, y1);
                let d2 = par2.distancesqr(x1, y1);

                if(!closerToOthers(d1, d2, i, j, x1, y1)){                    
                    let values = linePoints.get(`${i}${j}`) == undefined ? [] : linePoints.get(`${i}${j}`); //array
                    values.push([x1, y1])
                    linePoints.set(`${i}${j}`, values)
                }else{
                    if(index!=-1){
                        lines[index].smallerEnd = true;
                    }
                }
            }else{
                if(index!=-1){
                    lines[index].smallerEnd = true;
                }
            }

            let x2 = (-b+Math.sqrt(b**2 - 4*a*c))/(2*a);
            let y2 = (par1.a*(x2**2)) + (par1.b*x2) + par1.c
            
            if(x2 < container.width && x2>0 && y2<container.height && y2 >0){
                let d12 = par1.distancesqr(x2, y2);
                let d22 = par2.distancesqr(x2, y2);

                if(!closerToOthers(d12, d22, i, j, x2, y2)){                    
                    values = linePoints.get(`${i}${j}`) == undefined ? [] : linePoints.get(`${i}${j}`); //array
                    values.push([x2, y2])
                    linePoints.set(`${i}${j}`, values)
                }else{
                    if(index!=-1){
                        lines[index].biggerEnd = true;
                    }
                }
            }else{
                if(index!=-1){
                    lines[index].biggerEnd = true;
                }
            }                         
        }
    }    
}

function closerToOthers(di, dj, i, j, x, y){
    for (let index = 0; index < parabolaCon.length; index++) {        
        if(index != i && index != j){
            let d = parabolaCon[index].distancesqr(x, y);
            if(d < di || d < dj){
                return true;
            }
        }
    }
    return false;
}


function distancesqr([x1,y1], [x2, y2]){
    return ((x1-x2)**2 + (y1-y2)**2);
}

function drawLines(){
    let exists = false;
    let first = lines.length == 0;
    for(let [key, value] of linePoints){
        if(first){
            let line = new Line(key, value);
            lines.push(line);
            svgcanvas.appendChild(line.svgo)
        }else{
            for(let line of lines){
                if(line.id == key){
                    line.points = value;
                    line.update();
                    exists = true;
                }
            }
            if(!exists){
                let newLine = new Line(key, value);
                lines.push(newLine);
                svgcanvas.appendChild(newLine.svgo)
            }
            exists = false;
        }
    }
}

let keymap = {};
onkeydown = onkeyup = function(e){
    keymap[e.key] = e.type == 'keydown';
    if(!started){
        if(keymap["s"] || keymap[" "] || keymap["Enter"]){started = true; globalID = requestAnimationFrame(update);}        
    }
};

const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click",()=>{
    if(!started){
        started=true;
        globalID = requestAnimationFrame(update);
    }
}, false)

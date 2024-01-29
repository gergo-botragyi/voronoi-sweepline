let svgcanvas = document.getElementById("svgcanvas");
svgcanvas.addEventListener("mousedown", placePoint, false);
const container = svgcanvas.getBoundingClientRect();
let globalID;

let started = false;
let points = [];
let parabolaIndexes = [];
let parabolaCon = [];
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
                console.log(parabolaCon[i].a+" "+parabolaCon[i].b+" "+parabolaCon[i].c)
                console.log(parabolaCon[j].a+" "+parabolaCon[j].b+" "+parabolaCon[j].c)
                let a = parabolaCon[i].a-parabolaCon[j].a;
                let b = parabolaCon[i].b-parabolaCon[j].b;
                let c = (parabolaCon[i].c-parabolaCon[i].p)-(parabolaCon[j].c-parabolaCon[j].p);

                let x1 = (-b+Math.sqrt(b**2 - 4*a*c))/(2*a);
                let y1 = (parabolaCon[i].a*(x1**2)) + (parabolaCon[i].b*x1) + parabolaCon[i].c
                console.log(x1+" "+y1)

                let x2 = (-b-Math.sqrt(b**2 - 4*a*c))/(2*a);
                let y2 = (parabolaCon[i].a*(x2**2)) + (parabolaCon[i].b*x2) + parabolaCon[i].c
                console.log(x2+" "+y2)
                
                let intersection1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                intersection1.setAttribute("cx", x1);
                intersection1.setAttribute("cy", y1);
                intersection1.setAttribute("r", "2");
                intersection1.setAttribute("stroke", "red");
                intersection1.setAttribute("fill", "red");
                svgcanvas.appendChild(intersection1)                    
                
                let intersection2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                intersection2.setAttribute("cx", x2);
                intersection2.setAttribute("cy", y2);
                intersection2.setAttribute("r", "2");
                intersection2.setAttribute("stroke", "red");
                intersection2.setAttribute("fill", "red");
                svgcanvas.appendChild(intersection2)
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
const SCALE = 40

export default function autoPack(loads, truck){

const binWidth = truck.length * SCALE
const binHeight = truck.width * SCALE

let freeRects = [{
x:0,
y:0,
width:binWidth,
height:binHeight
}]

let placed=[]

const sorted=[...loads].sort((a,b)=>
(b.length*b.width)-(a.length*a.width)
)

for(let load of sorted){

let bestNode=null
let bestRectIndex=-1
let bestArea=Infinity
let rotated=false

for(let i=0;i<freeRects.length;i++){

const rect=freeRects[i]

let w = load.length*SCALE
let h = load.width*SCALE

// normal
if(w<=rect.width && h<=rect.height){

let area=rect.width*rect.height-w*h

if(area<bestArea){

bestNode={x:rect.x,y:rect.y,w,h}
bestArea=area
bestRectIndex=i
rotated=false

}

}

// rotated
if(h<=rect.width && w<=rect.height){

let area=rect.width*rect.height-h*w

if(area<bestArea){

bestNode={x:rect.x,y:rect.y,w:h,h:w}
bestArea=area
bestRectIndex=i
rotated=true

}

}

}

if(!bestNode) continue

let rect=freeRects[bestRectIndex]

freeRects.splice(bestRectIndex,1)

// split free space
freeRects.push({
x:rect.x + bestNode.w,
y:rect.y,
width:rect.width - bestNode.w,
height:bestNode.h
})

freeRects.push({
x:rect.x,
y:rect.y + bestNode.h,
width:rect.width,
height:rect.height - bestNode.h
})

placed.push({
...load,
length: rotated ? load.width : load.length,
width: rotated ? load.length : load.width,
x:bestNode.x,
y:bestNode.y
})

}

return placed

}
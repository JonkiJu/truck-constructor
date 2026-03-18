export default function isColliding(load, loads, index){

for(let i=0;i<loads.length;i++){

if(i===index) continue

const a=load
const b=loads[i]

if(
a.x < b.x + b.width*40 &&
a.x + a.width*40 > b.x &&
a.y < b.y + b.length*40 &&
a.y + a.length*40 > b.y
){
return true
}

}

return false

}
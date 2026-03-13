import { Rect,Text,Group } from "react-konva"
import { formatValue } from "../utils/units"

const SCALE=40

export default function LoadBox({
load,
index,
loads,
setLoads,
openMenu,
unit
}){

return(

<Group
x={load.x}
y={load.y}
draggable

onDragEnd={e=>{

let newLoads=[...loads]

newLoads[index].x=e.target.x()
newLoads[index].y=e.target.y()

setLoads(newLoads)

}}

onContextMenu={e=>{

e.evt.preventDefault()

openMenu({
x:e.evt.clientX,
y:e.evt.clientY,
index
})

}}

>

<Rect
width={load.length*SCALE}
height={load.width*SCALE}
fill="#ffb347"
stroke="black"
/>

<Text
text={`${formatValue(load.length,unit)} x ${formatValue(load.width,unit)} ${unit}`}
width={load.length*SCALE}
height={load.width*SCALE}
align="center"
verticalAlign="middle"
/>

</Group>

)

}
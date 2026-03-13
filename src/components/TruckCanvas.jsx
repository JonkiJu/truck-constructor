import { Stage,Layer,Rect,Text } from "react-konva"
import LoadBox from "./LoadBox"
import { formatValue } from "../utils/units"

const SCALE=40

export default function TruckCanvas({
truck,
loads,
setLoads,
openMenu,
unit
}){



const stageWidth = window.innerWidth
const stageHeight = window.innerHeight

const truckWidth = truck.length*SCALE
const truckHeight = truck.width*SCALE

const truckX=(stageWidth-truckWidth)/2
const truckY=(stageHeight-truckHeight)/2


return(

<Stage width={stageWidth} height={stageHeight}>

<Layer>

<Rect
x={truckX}
y={truckY}
width={truckWidth}
height={truckHeight}
stroke="black"
strokeWidth={4}
/>

<Text
x={truckX+truckWidth/2-50}
y={truckY-30}
text={`${formatValue(truck.length,unit)} ${unit}`}
fontSize={20}
/>

<Text
x={truckX-80}
y={truckY+truckHeight/2}
text={`${formatValue(truck.width,unit)} ${unit}`}
fontSize={20}
/>

{loads.map((load,i)=>(
<LoadBox
key={i}
load={load}
index={i}
loads={loads}
setLoads={setLoads}
openMenu={openMenu}
unit={unit}
truckX={truckX}
truckY={truckY}
/>
))}

</Layer>

</Stage>

)

}
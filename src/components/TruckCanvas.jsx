import { useEffect, useRef, useState } from "react"
import { Stage,Layer,Rect,Text } from "react-konva"
import LoadBox from "./LoadBox"
import { formatValue } from "../utils/units"

const SCALE=40
const FRAME_PADDING = 1

export default function TruckCanvas({
truck,
loads,
setLoads,
openMenu,
unit,
stickyEnabled,
stickyDistance,
collisionEnabled
}){

const [viewport, setViewport] = useState({
	width: window.innerWidth,
	height: window.innerHeight
})
const prevTruckOriginRef = useRef(null)

useEffect(() => {

	function handleResize() {
		setViewport({
			width: window.innerWidth,
			height: window.innerHeight
		})
	}

	window.addEventListener("resize", handleResize)

	return () => {
		window.removeEventListener("resize", handleResize)
	}

}, [])

const stageWidth = viewport.width
const stageHeight = viewport.height

const truckWidth = truck.length*SCALE
const truckHeight = truck.width*SCALE

const truckX=(stageWidth-truckWidth)/2
const truckY=(stageHeight-truckHeight)/2

useEffect(() => {
	const prevOrigin = prevTruckOriginRef.current

	if (!prevOrigin) {
		prevTruckOriginRef.current = { x: truckX, y: truckY }
		return
	}

	const dx = truckX - prevOrigin.x
	const dy = truckY - prevOrigin.y

	prevTruckOriginRef.current = { x: truckX, y: truckY }

	if (dx === 0 && dy === 0) {
		return
	}

	setLoads(prevLoads => prevLoads.map(load => ({
		...load,
		x: load.x + dx,
		y: load.y + dy
	})))
}, [truckX, truckY, setLoads])

const paddedTruckWidth = truckWidth + 140
const paddedTruckHeight = truckHeight + 140

const scaleX = (stageWidth - 24) / paddedTruckWidth
const scaleY = (stageHeight - 24) / paddedTruckHeight
const canvasScale = Math.min(1, scaleX, scaleY)

const layerOffsetX = (stageWidth - stageWidth * canvasScale) / 2
const layerOffsetY = (stageHeight - stageHeight * canvasScale) / 2


return(

<Stage width={stageWidth} height={stageHeight}>

<Layer
x={layerOffsetX}
y={layerOffsetY}
scaleX={canvasScale}
scaleY={canvasScale}
>

<Rect
x={truckX - FRAME_PADDING}
y={truckY - FRAME_PADDING}
width={truckWidth + FRAME_PADDING * 2}
height={truckHeight + FRAME_PADDING * 2}
stroke="black"
strokeWidth={5}
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
truckWidth={truckWidth}
truckHeight={truckHeight}
stickyEnabled={stickyEnabled}
stickyDistance={stickyDistance}
collisionEnabled={collisionEnabled}
/>
))}

</Layer>

</Stage>

)

}
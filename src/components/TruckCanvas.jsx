import { useEffect, useRef, useState } from "react"
import { Stage,Layer,Rect,Text,Line,Circle } from "react-konva"
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
collisionEnabled,
rulerMode
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

const truckWidth = truck.width*SCALE
const truckHeight = truck.length*SCALE

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
const [rulerStart, setRulerStart] = useState(null)
const [rulerEnd, setRulerEnd] = useState(null)

useEffect(() => {
	if (!rulerMode) {
		setRulerStart(null)
		setRulerEnd(null)
	}
}, [rulerMode])

function getCanvasPoint(event) {
	const stage = event.target.getStage()
	const pointer = stage?.getPointerPosition()

	if (!pointer) {
		return null
	}

	return {
		x: (pointer.x - layerOffsetX) / canvasScale,
		y: (pointer.y - layerOffsetY) / canvasScale
	}
}

function handleCanvasPointerDown(event) {
	if (!rulerMode) {
		return
	}

	const point = getCanvasPoint(event)

	if (!point) {
		return
	}

	if (!rulerStart || (rulerStart && rulerEnd)) {
		setRulerStart(point)
		setRulerEnd(null)
		return
	}

	setRulerEnd(point)
}

const distancePixels = rulerStart && rulerEnd
	? Math.hypot(rulerEnd.x - rulerStart.x, rulerEnd.y - rulerStart.y)
	: 0

const distanceInFeet = distancePixels / SCALE
const rulerLabelX = rulerStart && rulerEnd ? (rulerStart.x + rulerEnd.x) / 2 : 0
const rulerLabelY = rulerStart && rulerEnd ? (rulerStart.y + rulerEnd.y) / 2 : 0


return(

<Stage width={stageWidth} height={stageHeight} onMouseDown={handleCanvasPointerDown} onTouchStart={handleCanvasPointerDown}>

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
text={`${formatValue(truck.width,unit)} ${unit}`}
fontSize={20}
/>

<Text
x={truckX-80}
y={truckY+truckHeight/2}
text={`${formatValue(truck.length,unit)} ${unit}`}
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
interactionEnabled={!rulerMode}
/>
))}

{rulerStart && (
<Circle x={rulerStart.x} y={rulerStart.y} radius={6} fill="#2563eb" />
)}

{rulerStart && rulerEnd && (
<>
<Line
points={[rulerStart.x, rulerStart.y, rulerEnd.x, rulerEnd.y]}
stroke="#0f172a"
strokeWidth={3}
dash={[8, 6]}
/>

<Circle x={rulerEnd.x} y={rulerEnd.y} radius={6} fill="#0f766e" />

<Text
x={rulerLabelX + 8}
y={rulerLabelY - 24}
text={`${formatValue(distanceInFeet, unit)} ${unit}`}
fontSize={18}
fontStyle="bold"
fill="#0f172a"
/>
</>
)}

</Layer>

</Stage>

)

}
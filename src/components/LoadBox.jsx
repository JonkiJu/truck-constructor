import { useRef } from "react"
import { Rect,Text,Group } from "react-konva"
import { formatValue } from "../utils/units"
import isColliding from "../utils/collision"

const SCALE=40

export default function LoadBox({
load,
index,
loads,
setLoads,
openMenu,
unit
,
truckX,
truckY,
truckWidth,
truckHeight,
stickyEnabled,
stickyDistance,
collisionEnabled
}){

function applyStickyEdge(nextX, nextY) {
	if (!stickyEnabled || stickyDistance <= 0) {
		return { x: nextX, y: nextY }
	}

	const widthPx = load.length * SCALE
	const heightPx = load.width * SCALE

	const left = truckX
	const right = truckX + truckWidth
	const top = truckY
	const bottom = truckY + truckHeight

	let x = nextX
	let y = nextY

	// snap to truck walls
	const gapLeftInside = x - left
	if (gapLeftInside >= 0 && gapLeftInside <= stickyDistance) x = left
	const gapRightInside = right - (x + widthPx)
	if (gapRightInside >= 0 && gapRightInside <= stickyDistance) x = right - widthPx
	const overLeft = left - x
	if (overLeft > 0 && overLeft <= stickyDistance) x = left
	const overRight = x + widthPx - right
	if (overRight > 0 && overRight <= stickyDistance) x = right - widthPx
	const gapTopInside = y - top
	if (gapTopInside >= 0 && gapTopInside <= stickyDistance) y = top
	const gapBottomInside = bottom - (y + heightPx)
	if (gapBottomInside >= 0 && gapBottomInside <= stickyDistance) y = bottom - heightPx
	const overTop = top - y
	if (overTop > 0 && overTop <= stickyDistance) y = top
	const overBottom = y + heightPx - bottom
	if (overBottom > 0 && overBottom <= stickyDistance) y = bottom - heightPx

	// snap to edges of other loads
	for (let i = 0; i < loads.length; i++) {
		if (i === index) continue

		const other = loads[i]
		const oW = other.length * SCALE
		const oH = other.width * SCALE

		// right edge of dragged → left edge of other
		if (Math.abs((x + widthPx) - other.x) <= stickyDistance) x = other.x - widthPx
		// left edge of dragged → right edge of other
		if (Math.abs(x - (other.x + oW)) <= stickyDistance) x = other.x + oW
		// bottom edge of dragged → top edge of other
		if (Math.abs((y + heightPx) - other.y) <= stickyDistance) y = other.y - heightPx
		// top edge of dragged → bottom edge of other
		if (Math.abs(y - (other.y + oH)) <= stickyDistance) y = other.y + oH
	}

	return { x, y }
}

const longPressTimer = useRef(null)

function clearLongPress() {
	if (longPressTimer.current) {
		clearTimeout(longPressTimer.current)
		longPressTimer.current = null
	}
}

function getCandidateLoads(nextX, nextY) {
	const candidate = [...loads]

	candidate[index] = {
		...candidate[index],
		x: nextX,
		y: nextY
	}

	return candidate
}

return(

<Group
x={load.x}
y={load.y}
draggable

onTouchStart={e => {
	const touch = e.evt.touches[0]
	if (!touch) return
	const clientX = touch.clientX
	const clientY = touch.clientY
	longPressTimer.current = setTimeout(() => {
		if (navigator.vibrate) navigator.vibrate(50)
		openMenu({ x: clientX, y: clientY, index, touch: true })
	}, 600)
}}

onTouchEnd={() => {
	clearLongPress()
}}

onDragStart={e => {
	clearLongPress()
	e.target.setAttr("lastValidX", load.x)
	e.target.setAttr("lastValidY", load.y)
}}

onDragMove={e => {

	const nextPos = applyStickyEdge(e.target.x(), e.target.y())
	const candidateLoads = getCandidateLoads(nextPos.x, nextPos.y)

	if (collisionEnabled && isColliding(candidateLoads[index], candidateLoads, index)) {
		e.target.x(e.target.getAttr("lastValidX") ?? load.x)
		e.target.y(e.target.getAttr("lastValidY") ?? load.y)
		return
	}

	e.target.x(nextPos.x)
	e.target.y(nextPos.y)
	e.target.setAttr("lastValidX", nextPos.x)
	e.target.setAttr("lastValidY", nextPos.y)

}}

onDragEnd={e=>{

let newLoads=[...loads]

newLoads[index].x=e.target.getAttr("lastValidX") ?? load.x
newLoads[index].y=e.target.getAttr("lastValidY") ?? load.y

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
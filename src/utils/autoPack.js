const SCALE = 40

export default function autoPack(loads, truck){

const binWidth = truck.length * SCALE
const binHeight = truck.width * SCALE

const sortStrategies = [
	(a, b) => (b.length * b.width) - (a.length * a.width),
	(a, b) => Math.max(b.length, b.width) - Math.max(a.length, a.width),
	(a, b) => b.length - a.length,
	(a, b) => b.width - a.width
]

let bestResult = []
let bestUsedArea = 0

for (const strategy of sortStrategies) {
	const sorted = [...loads].sort(strategy)
	const packed = packWithMaxRects(sorted, binWidth, binHeight)
	const usedArea = packed.reduce((sum, load) => sum + load.length * load.width, 0)

	if (packed.length > bestResult.length || (packed.length === bestResult.length && usedArea > bestUsedArea)) {
		bestResult = packed
		bestUsedArea = usedArea
	}

	if (bestResult.length === loads.length) {
		break
	}
}

return bestResult

}

function packWithMaxRects(loads, binWidth, binHeight) {

let freeRects = [{ x: 0, y: 0, width: binWidth, height: binHeight }]
const placed = []

for (const load of loads) {
	const node = findBestNode(freeRects, load)

	if (!node) {
		continue
	}

	freeRects = splitFreeRects(freeRects, node)
	freeRects = pruneFreeRects(freeRects)

	placed.push({
		...load,
		length: node.rotated ? load.width : load.length,
		width: node.rotated ? load.length : load.width,
		x: node.x,
		y: node.y
	})
}

return placed

}

function findBestNode(freeRects, load) {

let bestNode = null
let bestShortSide = Infinity
let bestLongSide = Infinity

const originalWidth = load.length * SCALE
const originalHeight = load.width * SCALE

for (const rect of freeRects) {
	const candidates = [
		{ w: originalWidth, h: originalHeight, rotated: false },
		{ w: originalHeight, h: originalWidth, rotated: true }
	]

	for (const candidate of candidates) {
		if (candidate.w > rect.width || candidate.h > rect.height) {
			continue
		}

		const leftoverHoriz = rect.width - candidate.w
		const leftoverVert = rect.height - candidate.h
		const shortSide = Math.min(leftoverHoriz, leftoverVert)
		const longSide = Math.max(leftoverHoriz, leftoverVert)

		if (shortSide < bestShortSide || (shortSide === bestShortSide && longSide < bestLongSide)) {
			bestNode = {
				x: rect.x,
				y: rect.y,
				w: candidate.w,
				h: candidate.h,
				rotated: candidate.rotated
			}
			bestShortSide = shortSide
			bestLongSide = longSide
		}
	}
}

return bestNode

}

function splitFreeRects(freeRects, usedNode) {

const result = []

for (const rect of freeRects) {
	if (!intersects(rect, usedNode)) {
		result.push(rect)
		continue
	}

	if (usedNode.x > rect.x) {
		result.push({
			x: rect.x,
			y: rect.y,
			width: usedNode.x - rect.x,
			height: rect.height
		})
	}

	if (usedNode.x + usedNode.w < rect.x + rect.width) {
		result.push({
			x: usedNode.x + usedNode.w,
			y: rect.y,
			width: rect.x + rect.width - (usedNode.x + usedNode.w),
			height: rect.height
		})
	}

	if (usedNode.y > rect.y) {
		result.push({
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: usedNode.y - rect.y
		})
	}

	if (usedNode.y + usedNode.h < rect.y + rect.height) {
		result.push({
			x: rect.x,
			y: usedNode.y + usedNode.h,
			width: rect.width,
			height: rect.y + rect.height - (usedNode.y + usedNode.h)
		})
	}
}

return result.filter(rect => rect.width > 0 && rect.height > 0)

}

function pruneFreeRects(freeRects) {

const pruned = []

for (let i = 0; i < freeRects.length; i++) {
	let isContained = false

	for (let j = 0; j < freeRects.length; j++) {
		if (i === j) {
			continue
		}

		if (isContainedIn(freeRects[i], freeRects[j])) {
			isContained = true
			break
		}
	}

	if (!isContained) {
		pruned.push(freeRects[i])
	}
}

return pruned

}

function intersects(a, b) {
	return !(
		b.x >= a.x + a.width ||
		b.x + b.w <= a.x ||
		b.y >= a.y + a.height ||
		b.y + b.h <= a.y
	)
}

function isContainedIn(a, b) {
	return (
		a.x >= b.x &&
		a.y >= b.y &&
		a.x + a.width <= b.x + b.width &&
		a.y + a.height <= b.y + b.height
	)
}
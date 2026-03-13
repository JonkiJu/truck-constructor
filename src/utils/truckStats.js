export default function truckStats(loads = [], truck) {

  if (!Array.isArray(loads) || !truck) {
    return {
      usedArea: 0,
      totalArea: 0,
      percent: 0,
      count: 0
    }
  }

  let usedArea = 0

  for (const load of loads) {
    usedArea += load.width * load.length
  }

  const totalArea = truck.width * truck.length
  const percent = totalArea ? (usedArea / totalArea * 100).toFixed(1) : 0

  return {
    usedArea,
    totalArea,
    percent,
    count: loads.length
  }
}
import { useEffect, useState } from "react"
import TruckCanvas from "./components/TruckCanvas"
import AddLoadPanel from "./components/AddLoadPanel"
import TruckModal from "./components/TruckModal"
import ContextMenu from "./components/ContextMenu"
import UnitToggle from "./components/UnitToggle"
import autoPack from "./utils/autoPack"

const SCALE = 40
const STORAGE_KEYS = {
  unit: "truck-builder-unit",
  stickyEnabled: "truck-builder-sticky-enabled",
  stickyDistance: "truck-builder-sticky-distance",
  collisionEnabled: "truck-builder-collision-enabled"
}

function getStoredString(key, fallback) {
  const value = window.localStorage.getItem(key)
  return value ?? fallback
}

function getStoredBoolean(key, fallback) {
  const value = window.localStorage.getItem(key)

  if (value === null) {
    return fallback
  }

  return value === "true"
}

function getStoredNumber(key, fallback) {
  const value = window.localStorage.getItem(key)
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : fallback
}

export default function App(){

const [unit,setUnit] = useState(() => getStoredString(STORAGE_KEYS.unit, "ft"))

const [truck,setTruck] = useState(null)
const [loads,setLoads] = useState([])
const [nextLoadId, setNextLoadId] = useState(1)
const [stickyEnabled, setStickyEnabled] = useState(() => getStoredBoolean(STORAGE_KEYS.stickyEnabled, true))
const [stickyDistance, setStickyDistance] = useState(() => getStoredNumber(STORAGE_KEYS.stickyDistance, 5))
const [collisionEnabled, setCollisionEnabled] = useState(() => getStoredBoolean(STORAGE_KEYS.collisionEnabled, true))
const [menu,setMenu] = useState(null)
const [panelOpen, setPanelOpen] = useState(false)

useEffect(() => {
  window.localStorage.setItem(STORAGE_KEYS.unit, unit)
}, [unit])

useEffect(() => {
  window.localStorage.setItem(STORAGE_KEYS.stickyEnabled, String(stickyEnabled))
}, [stickyEnabled])

useEffect(() => {
  window.localStorage.setItem(STORAGE_KEYS.stickyDistance, String(stickyDistance))
}, [stickyDistance])

useEffect(() => {
  window.localStorage.setItem(STORAGE_KEYS.collisionEnabled, String(collisionEnabled))
}, [collisionEnabled])

function togglePanel(){
  setPanelOpen(prev => !prev)
}

function addLoad({length,width,qty}){

let newLoads=[...loads]
let idSeed = nextLoadId

for(let i=0;i<qty;i++){

const spawnX = 100 + i * 40
const spawnY = 100

newLoads.push({
id: idSeed,
length,
width,
x:spawnX,
y:spawnY,
spawnX,
spawnY
})

idSeed += 1

}

setLoads(newLoads)
setNextLoadId(idSeed)

}

function clearLoads(){

setLoads([])
setMenu(null)

}

function removeLoad(index){

setLoads(loads.filter((_,i)=>i!==index))
setMenu(null)

}

function rotateLoad(index){

let newLoads=[...loads]

let l=newLoads[index].length
let w=newLoads[index].width

newLoads[index].length=w
newLoads[index].width=l

setLoads(newLoads)
setMenu(null)

}

function handleAutoPack(){

const stageWidth = window.innerWidth
const stageHeight = window.innerHeight

const truckWidth = truck.length * SCALE
const truckHeight = truck.width * SCALE

const truckX = (stageWidth - truckWidth) / 2
const truckY = (stageHeight - truckHeight) / 2

const packed = autoPack(loads, truck).map(load => ({
  ...load,
  x: load.x + truckX,
  y: load.y + truckY
}))

const packedById = new Map(packed.map(load => [load.id, load]))

const mergedLoads = loads.map(load => {

  const packedLoad = packedById.get(load.id)

  if (packedLoad) {
    return packedLoad
  }

  return {
    ...load,
    x: load.spawnX ?? load.x,
    y: load.spawnY ?? load.y
  }

})

setLoads(mergedLoads)

if(packed.length < loads.length){
  alert("sorry there is no empty place left")
}

}


return(

<div>

<UnitToggle unit={unit} setUnit={setUnit}/>

{!truck && (
<TruckModal unit={unit} onCreate={setTruck}/>
)}

{truck && (

<>

<AddLoadPanel
  addLoad={addLoad}
  onAutoPack={handleAutoPack}
  onClearLoads={clearLoads}
  stickyEnabled={stickyEnabled}
  stickyDistance={stickyDistance}
  onToggleSticky={setStickyEnabled}
  onChangeStickyDistance={setStickyDistance}
  collisionEnabled={collisionEnabled}
  onToggleCollision={setCollisionEnabled}
  unit={unit}
  isOpen={panelOpen}
  toggle={togglePanel}
/>

<TruckCanvas
truck={truck}
loads={loads}
setLoads={setLoads}
openMenu={setMenu}
unit={unit}
stickyEnabled={stickyEnabled}
stickyDistance={stickyDistance}
collisionEnabled={collisionEnabled}
/>

{menu && (

<ContextMenu
x={menu.x}
y={menu.y}
index={menu.index}
onRotate={rotateLoad}
onDelete={removeLoad}
/>

)}

</>

)}

</div>

)

} 
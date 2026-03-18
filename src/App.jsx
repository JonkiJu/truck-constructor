import { useEffect, useState } from "react"
import TruckCanvas from "./components/TruckCanvas"
import AddLoadPanel from "./components/AddLoadPanel"
import TruckModal from "./components/TruckModal"
import ContextMenu from "./components/ContextMenu"
import UnitToggle from "./components/UnitToggle"
import autoPack from "./utils/autoPack"

const SCALE = 40
const MAX_TRUCK_TABS = 5
const STORAGE_KEYS = {
  unit: "truck-builder-unit",
  stickyEnabled: "truck-builder-sticky-enabled",
  stickyDistance: "truck-builder-sticky-distance",
  collisionEnabled: "truck-builder-collision-enabled",
  truckTabs: "truck-builder-tabs",
  activeTruckTabId: "truck-builder-active-tab-id"
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

  if (value === null) {
    return fallback
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : fallback
}

function getStoredJson(key, fallback) {
  const raw = window.localStorage.getItem(key)

  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function getStoredTruckTabs() {
  const stored = getStoredJson(STORAGE_KEYS.truckTabs, [])

  if (!Array.isArray(stored)) {
    return []
  }

  return stored
    .slice(0, MAX_TRUCK_TABS)
    .filter(tab => tab && typeof tab.id === "string" && tab.truck)
    .map(tab => {
      const length = Number(tab.truck.length)
      const width = Number(tab.truck.width)

      if (!Number.isFinite(length) || !Number.isFinite(width)) {
        return null
      }

      return {
        id: tab.id,
        name: typeof tab.name === "string" && tab.name.trim() ? tab.name.trim() : "Truck",
        truck: { length, width },
        loads: []
      }
    })
    .filter(Boolean)
}

function getNextTruckName(existingTabs) {
  let i = 1

  while (existingTabs.some(tab => tab.name === `Truck ${i}`)) {
    i += 1
  }

  return `Truck ${i}`
}

export default function App(){

const [unit,setUnit] = useState(() => getStoredString(STORAGE_KEYS.unit, "in"))

const [truckTabs, setTruckTabs] = useState(() => getStoredTruckTabs())
const [activeTabId, setActiveTabId] = useState(() => getStoredString(STORAGE_KEYS.activeTruckTabId, null))
const [createModalOpen, setCreateModalOpen] = useState(() => getStoredTruckTabs().length === 0)
const [editingTruckId, setEditingTruckId] = useState(null)
const [nextLoadId, setNextLoadId] = useState(1)
const [stickyEnabled, setStickyEnabled] = useState(() => getStoredBoolean(STORAGE_KEYS.stickyEnabled, true))
const [stickyDistance, setStickyDistance] = useState(() => getStoredNumber(STORAGE_KEYS.stickyDistance, 5))
const [collisionEnabled, setCollisionEnabled] = useState(() => getStoredBoolean(STORAGE_KEYS.collisionEnabled, false))
const [menu,setMenu] = useState(null)
const [panelOpen, setPanelOpen] = useState(false)
const [rulerMode, setRulerMode] = useState(false)
const [recentCreatedLoads, setRecentCreatedLoads] = useState([])
const [viewport, setViewport] = useState({
  width: window.innerWidth,
  height: window.innerHeight
})

const activeTab = truckTabs.find(tab => tab.id === activeTabId) ?? null
const editingTruck = truckTabs.find(tab => tab.id === editingTruckId) ?? null
const truck = activeTab?.truck ?? null
const loads = activeTab?.loads ?? []

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

const totalArea = truck ? truck.length * truck.width : 0
const truckWidthPx = truck ? truck.length * SCALE : 0
const truckHeightPx = truck ? truck.width * SCALE : 0
const truckX = truck ? (viewport.width - truckWidthPx) / 2 : 0
const truckY = truck ? (viewport.height - truckHeightPx) / 2 : 0

const usedArea = truck
  ? loads.reduce((sum, load) => {
      const loadWidthPx = load.length * SCALE
      const loadHeightPx = load.width * SCALE

      const isInsideTruck =
        load.x >= truckX &&
        load.y >= truckY &&
        load.x + loadWidthPx <= truckX + truckWidthPx &&
        load.y + loadHeightPx <= truckY + truckHeightPx

      if (!isInsideTruck) {
        return sum
      }

      return sum + load.length * load.width
    }, 0)
  : 0
const usedPercent = totalArea > 0 ? (usedArea / totalArea) * 100 : 0

useEffect(() => {
  if (truckTabs.length === 0) {
    setActiveTabId(null)
    setCreateModalOpen(true)
    return
  }

  const exists = truckTabs.some(tab => tab.id === activeTabId)

  if (!exists) {
    setActiveTabId(truckTabs[0].id)
  }
}, [truckTabs, activeTabId])

useEffect(() => {
  const serializableTabs = truckTabs.map(tab => ({
    id: tab.id,
    name: tab.name,
    truck: tab.truck
  }))

  window.localStorage.setItem(STORAGE_KEYS.truckTabs, JSON.stringify(serializableTabs))
}, [truckTabs])

useEffect(() => {
  if (!activeTabId) {
    return
  }

  window.localStorage.setItem(STORAGE_KEYS.activeTruckTabId, activeTabId)
}, [activeTabId])

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

useEffect(() => {
  if (!menu) {
    return
  }

  function handleOutsideClick(event) {
    const clickedInsideMenu = event.target.closest(".context-menu")

    if (!clickedInsideMenu) {
      setMenu(null)
    }
  }

  window.addEventListener("pointerdown", handleOutsideClick)

  return () => {
    window.removeEventListener("pointerdown", handleOutsideClick)
  }
}, [menu])

useEffect(() => {
  if (rulerMode) {
    setMenu(null)
  }
}, [rulerMode])

function togglePanel(){
  setPanelOpen(prev => !prev)
}

function setActiveLoads(update) {
  if (!activeTabId) {
    return
  }

  setTruckTabs(prevTabs => prevTabs.map(tab => {
    if (tab.id !== activeTabId) {
      return tab
    }

    const nextLoads = typeof update === "function" ? update(tab.loads) : update

    return {
      ...tab,
      loads: nextLoads
    }
  }))
}

function createTruckTab({ name, length, width }) {
  if (truckTabs.length >= MAX_TRUCK_TABS) {
    return
  }

  const tabId = `truck-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`
  const tabName = name?.trim() || getNextTruckName(truckTabs)
  const newTab = {
    id: tabId,
    name: tabName,
    truck: { length, width },
    loads: []
  }

  setTruckTabs(prevTabs => [...prevTabs, newTab])
  setActiveTabId(tabId)
  setCreateModalOpen(false)
  setPanelOpen(false)
  setMenu(null)
  setRulerMode(false)
}

function updateTruckTab({ name, length, width }) {
  if (!editingTruckId) {
    return
  }

  setTruckTabs(prevTabs => prevTabs.map(tab => {
    if (tab.id !== editingTruckId) {
      return tab
    }

    return {
      ...tab,
      name: name?.trim() || tab.name,
      truck: { length, width }
    }
  }))

  setCreateModalOpen(false)
  setEditingTruckId(null)
  setMenu(null)
  setRulerMode(false)
}

function handleSaveTruck(payload) {
  if (editingTruckId) {
    updateTruckTab(payload)
    return
  }

  createTruckTab(payload)
}

function openCreateTruckModal() {
  if (truckTabs.length >= MAX_TRUCK_TABS) {
    return
  }

  setEditingTruckId(null)
  setCreateModalOpen(true)
}

function openEditTruckModal(tabId) {
  setEditingTruckId(tabId)
  setCreateModalOpen(true)
}

function deleteTruckTab(tabId) {
  const nextTabs = truckTabs.filter(tab => tab.id !== tabId)

  setTruckTabs(nextTabs)
  setMenu(null)
  setRulerMode(false)

  if (editingTruckId === tabId) {
    setEditingTruckId(null)
    setCreateModalOpen(false)
  }

  if (nextTabs.length === 0) {
    setActiveTabId(null)
    setCreateModalOpen(true)
    return
  }

  if (tabId === activeTabId) {
    const removedIndex = truckTabs.findIndex(tab => tab.id === tabId)
    const fallback = nextTabs[removedIndex] ?? nextTabs[nextTabs.length - 1]
    setActiveTabId(fallback.id)
  }
}

function selectTruckTab(tabId) {
  setActiveTabId(tabId)
  setMenu(null)
  setRulerMode(false)
}

function addLoad({length,width,qty,trackRecent = true}){

if (!truck) {
  return
}

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

setActiveLoads(newLoads)
setNextLoadId(idSeed)

if (trackRecent) {
  setRecentCreatedLoads(prev => [
    {
      id: `recent-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      length,
      width,
      qty
    },
    ...prev
  ].slice(0, 5))
}

}

function deleteRecentCreatedLoad(id) {
  setRecentCreatedLoads(prev => prev.filter(item => item.id !== id))
}

function clearLoads(){

setActiveLoads([])
setMenu(null)

}

function removeLoad(index){

setActiveLoads(prevLoads => prevLoads.filter((_,i)=>i!==index))
setMenu(null)

}

function rotateLoad(index){

setActiveLoads(prevLoads => {
  if (!prevLoads[index]) {
    return prevLoads
  }

  return prevLoads.map((load, i) => {
    if (i !== index) {
      return load
    }

    return {
      ...load,
      length: load.width,
      width: load.length
    }
  })
})
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

setActiveLoads(mergedLoads)

if(packed.length < loads.length){
  alert("sorry there is no empty place left")
}

}


return(

<div>

<UnitToggle
  unit={unit}
  setUnit={setUnit}
  usedArea={usedArea}
  totalArea={totalArea}
  usedPercent={usedPercent}
/>

{createModalOpen && (
<TruckModal
  unit={unit}
  setUnit={setUnit}
  onCreate={handleSaveTruck}
  defaultName={editingTruck?.name ?? getNextTruckName(truckTabs)}
  initialTruck={editingTruck?.truck}
  titleText={editingTruck ? "Edit Truck" : "Create Truck"}
  submitLabel={editingTruck ? "Save Truck" : "Create Truck"}
  canCancel={truckTabs.length > 0}
  onCancel={() => {
    setCreateModalOpen(false)
    setEditingTruckId(null)
  }}
/>
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
  rulerMode={rulerMode}
  onToggleRulerMode={setRulerMode}
  recentCreatedLoads={recentCreatedLoads}
  onDeleteRecentCreatedLoad={deleteRecentCreatedLoad}
  truckTabs={truckTabs}
  activeTruckId={activeTabId}
  onSelectTruck={selectTruckTab}
  onAddTruck={openCreateTruckModal}
  onEditTruck={openEditTruckModal}
  onDeleteTruck={deleteTruckTab}
  canAddTruck={truckTabs.length < MAX_TRUCK_TABS}
  unit={unit}
  isOpen={panelOpen}
  toggle={togglePanel}
/>

<TruckCanvas
key={activeTabId}
truck={truck}
loads={loads}
setLoads={setActiveLoads}
openMenu={setMenu}
unit={unit}
stickyEnabled={stickyEnabled}
stickyDistance={stickyDistance}
collisionEnabled={collisionEnabled}
rulerMode={rulerMode}
/>

{rulerMode && (
<button
  className={`ruler-exit-btn ${panelOpen ? "panel-open" : ""}`}
  onClick={() => setRulerMode(false)}
>
  ✕
</button>
)}

{menu && (

<ContextMenu
x={menu.x}
y={menu.y}
index={menu.index}
fromTouch={menu.touch}
onRotate={rotateLoad}
onDelete={removeLoad}
/>

)}

</>

)}

</div>

)

} 
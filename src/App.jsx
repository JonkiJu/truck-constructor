import { useState } from "react"
import TruckCanvas from "./components/TruckCanvas"
import AddLoadPanel from "./components/AddLoadPanel"
import TruckModal from "./components/TruckModal"
import ContextMenu from "./components/ContextMenu"
import UnitToggle from "./components/UnitToggle"
import autoPack from "./utils/autoPack"
import Hud from "./components/Hud"

export default function App(){

const [unit,setUnit] = useState("ft")

const [truck,setTruck] = useState(null)
const [loads,setLoads] = useState([])
const [menu,setMenu] = useState(null)
const [panelOpen, setPanelOpen] = useState(false)

function togglePanel(){
  setPanelOpen(prev => !prev)
}

function addLoad({length,width,qty}){

let newLoads=[...loads]

for(let i=0;i<qty;i++){

newLoads.push({
length,
width,
x:100+i*40,
y:100
})

}

setLoads(newLoads)

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
import { useState } from "react"
import { inchesToFeet } from "../utils/units"

export default function TruckModal({ onCreate }) {

  const [lengthFt,setLengthFt] = useState(0)
  const [lengthIn,setLengthIn] = useState(170)

  const [widthFt,setWidthFt] = useState(0)
  const [widthIn,setWidthIn] = useState(90)

  function create(){

    onCreate({
      length: inchesToFeet(lengthFt*12+lengthIn),
      width: inchesToFeet(widthFt*12+widthIn)
    })
  }

  return(

  <div className="modal">

    <div className="modal-box">

      <h2>Create Truck</h2>

      <label>Length </label>

      <div className="row">
        <input type="number" value={lengthFt} onChange={e=>setLengthFt(+e.target.value)} />
        <span>ft</span>

        <input type="number" value={lengthIn} onChange={e=>setLengthIn(+e.target.value)} />
        <span>in</span>
      </div>

      <label>Width</label>

      <div className="row">
        <input type="number" value={widthFt} onChange={e=>setWidthFt(+e.target.value)} />
        <span>ft</span>

        <input type="number" value={widthIn} onChange={e=>setWidthIn(+e.target.value)} />
        <span>in</span>
      </div>

      <button onClick={create} style={{ marginTop: '20px' }}>
        Create Truck
      </button>

    </div>

  </div>

  )
}
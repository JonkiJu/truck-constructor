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

    <div className="modal-box truck-modal">

      <div className="truck-modal-header">
        <p className="truck-modal-eyebrow">Truck Builder</p>
        <h2>Create Truck</h2>
        <p className="truck-modal-subtitle">Set internal dimensions before adding loads.</p>
      </div>

      <div className="truck-modal-section">
        <label>Length</label>

        <div className="row modal-row">
          <input type="number" min="0" value={lengthFt} onChange={e=>setLengthFt(+e.target.value)} />
          <span>ft</span>

          <input type="number" min="0" value={lengthIn} onChange={e=>setLengthIn(+e.target.value)} />
          <span>in</span>
        </div>
      </div>

      <div className="truck-modal-section">
        <label>Width</label>

        <div className="row modal-row">
          <input type="number" min="0" value={widthFt} onChange={e=>setWidthFt(+e.target.value)} />
          <span>ft</span>

          <input type="number" min="0" value={widthIn} onChange={e=>setWidthIn(+e.target.value)} />
          <span>in</span>
        </div>
      </div>

      <button className="truck-modal-cta" onClick={create}>
        Create Truck
      </button>

    </div>

  </div>

  )
}
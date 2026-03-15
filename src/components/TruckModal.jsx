import { useEffect, useState } from "react"
import { inchesToFeet } from "../utils/units"

const STORAGE_KEYS = {
  remember: "truck-builder-remember-truck-size",
  lengthFt: "truck-builder-truck-length-ft",
  lengthIn: "truck-builder-truck-length-in",
  widthFt: "truck-builder-truck-width-ft",
  widthIn: "truck-builder-truck-width-in"
}

function getStoredBoolean(key, fallback) {
  const value = window.localStorage.getItem(key)

  if (value === null) {
    return fallback
  }

  return value === "true"
}

function getStoredString(key, fallback) {
  const value = window.localStorage.getItem(key)
  return value ?? fallback
}

export default function TruckModal({ onCreate }) {

  const [rememberSize, setRememberSize] = useState(() => getStoredBoolean(STORAGE_KEYS.remember, false))

  const [lengthFt,setLengthFt] = useState(() => (
    getStoredBoolean(STORAGE_KEYS.remember, false)
      ? getStoredString(STORAGE_KEYS.lengthFt, "0")
      : "0"
  ))
  const [lengthIn,setLengthIn] = useState(() => (
    getStoredBoolean(STORAGE_KEYS.remember, false)
      ? getStoredString(STORAGE_KEYS.lengthIn, "171")
      : "171"
  ))

  const [widthFt,setWidthFt] = useState(() => (
    getStoredBoolean(STORAGE_KEYS.remember, false)
      ? getStoredString(STORAGE_KEYS.widthFt, "0")
      : "0"
  ))
  const [widthIn,setWidthIn] = useState(() => (
    getStoredBoolean(STORAGE_KEYS.remember, false)
      ? getStoredString(STORAGE_KEYS.widthIn, "91")
      : "91"
  ))

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.remember, String(rememberSize))

    if (!rememberSize) {
      window.localStorage.removeItem(STORAGE_KEYS.lengthFt)
      window.localStorage.removeItem(STORAGE_KEYS.lengthIn)
      window.localStorage.removeItem(STORAGE_KEYS.widthFt)
      window.localStorage.removeItem(STORAGE_KEYS.widthIn)
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.lengthFt, lengthFt)
    window.localStorage.setItem(STORAGE_KEYS.lengthIn, lengthIn)
    window.localStorage.setItem(STORAGE_KEYS.widthFt, widthFt)
    window.localStorage.setItem(STORAGE_KEYS.widthIn, widthIn)
  }, [rememberSize, lengthFt, lengthIn, widthFt, widthIn])

  function toNumber(value) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  function create(){

    const lengthFtNumber = toNumber(lengthFt)
    const lengthInNumber = toNumber(lengthIn)
    const widthFtNumber = toNumber(widthFt)
    const widthInNumber = toNumber(widthIn)

    onCreate({
      length: inchesToFeet(lengthFtNumber * 12 + lengthInNumber),
      width: inchesToFeet(widthFtNumber * 12 + widthInNumber)
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
          <input type="number" min="0" value={lengthFt} onChange={e=>setLengthFt(e.target.value)} />
          <span>ft</span>

          <input type="number" min="0" value={lengthIn} onChange={e=>setLengthIn(e.target.value)} />
          <span>in</span>
        </div>
      </div>

      <div className="truck-modal-section">
        <label>Width</label>

        <div className="row modal-row">
          <input type="number" min="0" value={widthFt} onChange={e=>setWidthFt(e.target.value)} />
          <span>ft</span>

          <input type="number" min="0" value={widthIn} onChange={e=>setWidthIn(e.target.value)} />
          <span>in</span>
        </div>
      </div>

      <label className="truck-modal-check">
        <input
          type="checkbox"
          checked={rememberSize}
          onChange={e => setRememberSize(e.target.checked)}
        />
        <span>Remember truck size</span>
      </label>

      <button className="truck-modal-cta" onClick={create}>
        Create Truck
      </button>

    </div>

  </div>

  )
}
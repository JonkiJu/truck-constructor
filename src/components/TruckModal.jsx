import { useEffect, useRef, useState } from "react"

const STORAGE_KEYS = {
  remember: "truck-builder-remember-truck-size",
  lengthFeet: "truck-builder-truck-length-feet",
  widthFeet: "truck-builder-truck-width-feet"
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

function formatNumber(value) {
  const rounded = Number(value.toFixed(2))
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

function toFeet(value, unit) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  return unit === "in" ? parsed / 12 : parsed
}

function fromFeet(value, unit) {
  return unit === "in" ? value * 12 : value
}

export default function TruckModal({
  unit,
  setUnit,
  onCreate,
  defaultName = "Truck 1",
  initialTruck,
  titleText = "Create Truck",
  submitLabel = "Create Truck",
  canCancel = false,
  onCancel
}) {

  const [rememberSize, setRememberSize] = useState(() => getStoredBoolean(STORAGE_KEYS.remember, false))
  const [lengthValue, setLengthValue] = useState(() => {
    if (getStoredBoolean(STORAGE_KEYS.remember, false)) {
      const savedFeet = Number(getStoredString(STORAGE_KEYS.lengthFeet, "14.25"))
      return formatNumber(fromFeet(Number.isFinite(savedFeet) ? savedFeet : 14.25, unit))
    }

    return unit === "in" ? "171" : "14.25"
  })
  const [widthValue, setWidthValue] = useState(() => {
    if (getStoredBoolean(STORAGE_KEYS.remember, false)) {
      const savedFeet = Number(getStoredString(STORAGE_KEYS.widthFeet, "7.58"))
      return formatNumber(fromFeet(Number.isFinite(savedFeet) ? savedFeet : 7.58, unit))
    }

    return unit === "in" ? "91" : "7.58"
  })
  const [truckName, setTruckName] = useState(defaultName)
  const prevUnitRef = useRef(unit)

  useEffect(() => {
    setTruckName(defaultName)
  }, [defaultName])

  useEffect(() => {
    if (!initialTruck) {
      return
    }

    // Seed modal fields from stored truck dimensions once for this truck.
    setLengthValue(formatNumber(fromFeet(initialTruck.length, unit)))
    setWidthValue(formatNumber(fromFeet(initialTruck.width, unit)))
    prevUnitRef.current = unit
  }, [initialTruck])

  useEffect(() => {
    if (prevUnitRef.current === unit) {
      return
    }

    const prevUnit = prevUnitRef.current

    setLengthValue(prev => formatNumber(fromFeet(toFeet(prev, prevUnit), unit)))
    setWidthValue(prev => formatNumber(fromFeet(toFeet(prev, prevUnit), unit)))
    prevUnitRef.current = unit
  }, [unit])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.remember, String(rememberSize))

    if (!rememberSize) {
      window.localStorage.removeItem(STORAGE_KEYS.lengthFeet)
      window.localStorage.removeItem(STORAGE_KEYS.widthFeet)
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.lengthFeet, String(toFeet(lengthValue, unit)))
    window.localStorage.setItem(STORAGE_KEYS.widthFeet, String(toFeet(widthValue, unit)))
  }, [rememberSize, lengthValue, widthValue, unit])

  function handleInputChange(setter) {
    return event => {
      setter(event.target.value)
    }
  }

  function create(){
    const lengthFeet = toFeet(lengthValue, unit)
    const widthFeet = toFeet(widthValue, unit)
    const normalizedName = truckName.trim() || defaultName

    onCreate({
      name: normalizedName,
      length: lengthFeet,
      width: widthFeet
    })
  }

  return(

  <div className="modal">

    <div className="modal-box truck-modal">

      <div className="truck-modal-header">
        <p className="truck-modal-eyebrow">Truck Builder</p>
        <h2>{titleText}</h2>
        <p className="truck-modal-subtitle">Set internal dimensions before adding loads.</p>
      </div>

      <div className="truck-modal-section">
        <label>Truck name</label>

        <div className="row modal-row modal-row-name">
          <input
            type="text"
            maxLength="28"
            value={truckName}
            onChange={handleInputChange(setTruckName)}
            placeholder="Truck name"
          />
        </div>
      </div>

      <div className="unit-toggle truck-modal-toggle">
        <button
          className={unit === "ft" ? "active" : ""}
          onClick={() => setUnit("ft")}
        >
          Feet
        </button>

        <button
          className={unit === "in" ? "active" : ""}
          onClick={() => setUnit("in")}
        >
          Inches
        </button>
      </div>

      <div className="truck-modal-section">
        <label>Length</label>

        <div className="row modal-row">
          <input type="number" min="0" step="0.01" value={lengthValue} onChange={handleInputChange(setLengthValue)} />
          <span>{unit}</span>
        </div>
      </div>

      <div className="truck-modal-section">
        <label>Width</label>

        <div className="row modal-row">
          <input type="number" min="0" step="0.01" value={widthValue} onChange={handleInputChange(setWidthValue)} />
          <span>{unit}</span>
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

      <div className="truck-modal-actions">
        {canCancel && (
          <button className="truck-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}

        <button className="truck-modal-cta" onClick={create}>
          {submitLabel}
        </button>
      </div>

    </div>

  </div>

  )
}
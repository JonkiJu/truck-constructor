import { useEffect, useState } from "react"
import { inchesToFeet } from "../utils/units"

export default function AddLoadPanel({
  addLoad,
  onAutoPack,
  onClearLoads,
  stickyEnabled,
  stickyDistance,
  onToggleSticky,
  onChangeStickyDistance,
  collisionEnabled,
  onToggleCollision,
  rulerMode,
  onToggleRulerMode,
  unit,
  isOpen,
  toggle
}) {

  const [stickyDistanceInput, setStickyDistanceInput] = useState(String(stickyDistance))

  useEffect(() => {
    setStickyDistanceInput(String(stickyDistance))
  }, [stickyDistance])

  function handleSubmit(e) {

    e.preventDefault()

    let length = Number(e.target.length.value)
    let width = Number(e.target.width.value)
    let qty = Number(e.target.qty.value)

    if (unit === "in") {
      length = inchesToFeet(length)
      width = inchesToFeet(width)
    }

    addLoad({ length, width, qty })
    e.target.reset()
  }

  function handleStickyDistanceChange(event) {
    const nextValue = event.target.value

    // Let users clear the field while editing (Backspace from "0" to empty).
    if (nextValue === "") {
      setStickyDistanceInput("")
      return
    }

    const numericValue = Number(nextValue)

    if (!Number.isFinite(numericValue)) {
      return
    }

    const clampedValue = Math.max(0, Math.min(10, numericValue))
    setStickyDistanceInput(String(clampedValue))
    onChangeStickyDistance(clampedValue)
  }

  function handleStickyDistanceBlur() {
    if (stickyDistanceInput === "") {
      setStickyDistanceInput("0")
      onChangeStickyDistance(0)
      return
    }

    const numericValue = Number(stickyDistanceInput)
    const clampedValue = Number.isFinite(numericValue) ? Math.max(0, Math.min(10, numericValue)) : 0

    setStickyDistanceInput(String(clampedValue))
    onChangeStickyDistance(clampedValue)
  }

  return (

    <>
      {/* BURGER BUTTON */}
      <button
        className="burger-btn"
        onClick={toggle}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* PANEL */}
      <form
        className={`side-panel ${isOpen ? "open" : ""}`}
        onSubmit={handleSubmit}
      >

        <h3>Add Load</h3>


        <input
name="length"
type="number"
step="any"
placeholder={`Length (${unit})`}
min="0"
required
/>

<input
name="width"
type="number"
step="any"
placeholder={`Width (${unit})`}
min="0"
required
/>

<input
name="qty"
type="number"
step="1"
min="1"
placeholder="Qty"
defaultValue="1"
/>

        <button type="submit">
          Add
        </button>

        <button type="button" className="auto-pack-btn" onClick={onAutoPack}>
          Auto Pack
        </button>

        <button type="button" className="clear-loads-btn" onClick={onClearLoads}>
          Clear Loads
        </button>

        <div className="sticky-settings">
          <label className="sticky-toggle">
            <input
              type="checkbox"
              checked={stickyEnabled}
              onChange={e => onToggleSticky(e.target.checked)}
            />
            Sticky Edge
          </label>

          <input
            type="number"
            min="0"
            max="10"
            step="1"
            value={stickyDistanceInput}
            onChange={handleStickyDistanceChange}
            onBlur={handleStickyDistanceBlur}
            disabled={!stickyEnabled}
            placeholder="Stickiness px"
          />

          <label className="sticky-toggle">
            <input
              type="checkbox"
              checked={collisionEnabled}
              onChange={e => onToggleCollision(e.target.checked)}
            />
            Collision
          </label>
        </div>

        <div className="ruler-settings">
          <button
            type="button"
            className={`ruler-btn ${rulerMode ? "active" : ""}`}
            onClick={() => onToggleRulerMode(prev => !prev)}
          >
            {rulerMode ? "Disable Ruler" : "Enable Ruler"}
          </button>
        </div>

      </form>
    </>
  )
}
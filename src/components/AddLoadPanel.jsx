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
  unit,
  isOpen,
  toggle
}) {

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
    // e.target.reset()
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
            step="1"
            value={stickyDistance}
            onChange={e => onChangeStickyDistance(Number(e.target.value) || 0)}
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

      </form>
    </>
  )
}
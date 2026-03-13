import { inchesToFeet } from "../utils/units"

export default function AddLoadPanel({ addLoad, unit, isOpen, toggle }) {

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
required
/>

<input
name="width"
type="number"
step="any"
placeholder={`Width (${unit})`}
required
/>

<input
name="qty"
type="number"
step="1"
placeholder="Qty"
defaultValue="1"
/>

        <button type="submit">
          Add
        </button>

      </form>
    </>
  )
}
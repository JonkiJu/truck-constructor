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
  truckTabs,
  activeTruckId,
  onSelectTruck,
  onAddTruck,
  onEditTruck,
  onDeleteTruck,
  canAddTruck,
  unit,
  isOpen,
  toggle
}) {

  const [panelTab, setPanelTab] = useState("loads")
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
        <div className="panel-tabs">
          <button
            type="button"
            className={`panel-tab ${panelTab === "loads" ? "active" : ""}`}
            onClick={() => setPanelTab("loads")}
          >
            Loads
          </button>

          <button
            type="button"
            className={`panel-tab ${panelTab === "trucks" ? "active" : ""}`}
            onClick={() => setPanelTab("trucks")}
          >
            Trucks
          </button>

          <button
            type="button"
            className={`panel-tab ${panelTab === "settings" ? "active" : ""}`}
            onClick={() => setPanelTab("settings")}
          >
            Settings
          </button>
        </div>

        {panelTab === "loads" && (
          <>
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

            <div className="ruler-settings">
              <button
                type="button"
                className={`ruler-btn ${rulerMode ? "active" : ""}`}
                onClick={() => onToggleRulerMode(prev => !prev)}
              >
                {rulerMode ? "Disable Ruler" : "Enable Ruler"}
              </button>
            </div>
          </>
        )}

        {panelTab === "trucks" && (
          <>
            <h3>Trucks</h3>

            <div className="truck-list-panel">
              {truckTabs.map(tab => (
                <div
                  key={tab.id}
                  className={`truck-list-item ${tab.id === activeTruckId ? "active" : ""}`}
                  onClick={() => onSelectTruck(tab.id)}
                >
                  <div className="truck-list-main">
                    <span className="truck-list-name">{tab.name}</span>
                    <span className="truck-list-size">{tab.truck.length.toFixed(2)} x {tab.truck.width.toFixed(2)} ft</span>
                  </div>

                  <div className="truck-list-actions" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      className="truck-icon-btn"
                      title="Edit truck"
                      onClick={() => onEditTruck(tab.id)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="truck-icon-btn danger"
                      title="Delete truck"
                      onClick={() => onDeleteTruck(tab.id)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M9 7V5C9 4.4 9.4 4 10 4H14C14.6 4 15 4.4 15 5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M7 7L8 19C8.1 19.6 8.5 20 9.1 20H14.9C15.5 20 15.9 19.6 16 19L17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="truck-add-btn"
              onClick={onAddTruck}
              disabled={!canAddTruck}
            >
              + Add Truck
            </button>
          </>
        )}

        {panelTab === "settings" && (
          <>
            <h3>Settings</h3>

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
          </>
        )}

      </form>
    </>
  )
}
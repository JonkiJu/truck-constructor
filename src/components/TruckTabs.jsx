import { useState } from "react"

export default function TruckTabs({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  canAdd
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleSelectTab(tabId) {
    onSelectTab(tabId)
    setMobileOpen(false)
  }

  function handleAddTab() {
    onAddTab()
    setMobileOpen(false)
  }

  return (
    <div className={`truck-tabs-bar ${mobileOpen ? "mobile-open" : ""}`}>
      <button
        type="button"
        className="truck-tabs-mobile-trigger"
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label="Toggle truck tabs"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="truck-tabs-list-wrap">
        <div className="truck-tabs-list">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`truck-tab ${tab.id === activeTabId ? "active" : ""}`}
              onClick={() => handleSelectTab(tab.id)}
              title={tab.name}
            >
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="truck-tab-add"
          onClick={handleAddTab}
          disabled={!canAdd}
          title={canAdd ? "Add truck" : "Maximum 5 trucks"}
        >
          +
        </button>
      </div>
    </div>
  )
}

import { formatValue } from "../utils/units"

export default function UnitToggle({
unit,
setUnit,
usedArea = 0,
totalArea = 0,
usedPercent = 0
}){

const safePercent = Math.max(0, Math.min(100, usedPercent))

return(

<div className="unit-toggle">

<button
className={unit==="ft" ? "active":""}
onClick={()=>setUnit("ft")}
>
Feet
</button>

<button
className={unit==="in" ? "active":""}
onClick={()=>setUnit("in")}
>
Inches
</button>

<div className="space-stats">
<p className="space-stats-label">Used Space</p>

<p className="space-stats-percent">{safePercent.toFixed(1)}%</p>

<p className="space-stats-values">
{formatValue(usedArea, unit)} / {formatValue(totalArea, unit)} {unit}
<sup>2</sup>
</p>
</div>

</div>

)

}
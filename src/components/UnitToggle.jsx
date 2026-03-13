export default function UnitToggle({unit,setUnit}){

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

</div>

)

}
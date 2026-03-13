import truckStats from "../utils/truckStats"

export default function Hud({onAutoPack,loads,truck}){

const stats = truckStats(loads,truck)

return(

<div className="hud">

<button onClick={onAutoPack}>
Auto Pack
</button>

<div className="counter">

      <div>Loads: {stats.count}</div>
      <div>Used: {stats.percent}%</div>

</div>

</div>

)

}
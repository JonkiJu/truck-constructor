export function feetToInches(ft){
  return Math.round(ft * 12)
}

export function inchesToFeet(inches){
  return inches / 12
}

export function formatValue(ft,unit){

  if(unit === "ft"){
    return ft.toFixed(2)
  }

  return feetToInches(ft)

}
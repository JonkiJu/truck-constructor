export default function ContextMenu({
x,
y,
index,
onRotate,
onDelete
}){

return(

<div
className="context-menu"
style={{
top:y,
left:x
}}
>

<div onClick={()=>onRotate(index)}>
Rotate
</div>

<div onClick={()=>onDelete(index)}>
Delete
</div>

</div>

)

}
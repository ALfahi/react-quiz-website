// this general button will take in 4 params,
// text: button text, can be an empty string
// onClick: what the button does,
//type: what type of button it is, e.g a form button, a normal button etc,
// className: used to give buttons a class
function Button({text, onClick, type = "button", className = "" }){

return(

    <button onClick = {onClick} type = {type} className = {className}>
        {text}
    </button>
)
}

export default Button
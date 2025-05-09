import "../css/Textbox.css"
// dynamic Textbox, on initialisation it will have a defualt text when it's empty.
// type will either be text or password for input field.
function Textbox({defaultText, type = "text", required = false, onChange}){

    return(
        <input type = {type} onChange = {onChange} className = "textbox"
        placeholder = {defaultText}
        required = {required}
        ></input>

    );
}

export default Textbox;
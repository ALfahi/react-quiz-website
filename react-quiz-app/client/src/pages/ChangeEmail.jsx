import {Link} from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import "../css/Form.css";

function ChangeEmail(){
    return(
        <>
        <main>
            <form className = "textboxContainer">
                <Textbox defaultText = "Enter Username"></Textbox>
                <Textbox defaultText = "Enter password"></Textbox>
                <Textbox defaultText = "Enter new email address"></Textbox>
            
                <div className = "enterButton">
                    <Link to = "/Login">
                        <Button text = "enter"></Button>
                    </Link>
                </div>
            </form>
        </main>
        </>
    )
}

export default ChangeEmail
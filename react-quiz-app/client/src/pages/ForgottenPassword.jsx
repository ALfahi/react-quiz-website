import {Link} from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";// adding extra dot to go up one level back into
// /src/ so that we can go into components.    

import "../css/Form.css";
import "../css/Login.css";


function ForgottenPassword(){
    return(
        <>
        <main>
            <form className = "textboxContainer">

                <Textbox defaultText = "Enter code:"></Textbox>

                <section className = "linkandButton">
                    <Button text = "resend code"></Button>

                    <div className = "enterButton">
                        <Link to = "/Login">
                            <Button text = "enter"></Button>
                        </Link>
                    </div>
                </section>
            </form>
        </main>
        </>
    ) 
}

export default ForgottenPassword
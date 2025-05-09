import {Link} from "react-router-dom";
import Button from "../components/Button";// adding extra dot to go up one level back into
// /src/ so that we can go into components. 
import Textbox from "../components/Textbox"; 
import "../css/Form.css"
import "../css/Login.css";


function Login(){
    return(
        <>
        <main>
            <form className = "textboxContainer">
                    <Textbox defaultText = "Enter Username or email"></Textbox>
                    <Textbox defaultText = "Enter password" type = "password"></Textbox>
                    <div className = "linkAndButton">
                        <Link to = "/ForgottenPassword">
                            <p className = "pageLink">Forgotten Password?</p>
                        </Link>

                        <div className = "enterButton">
                            <Link to = "/QuizMenu">
                                <Button text = "enter"></Button>
                            </Link>
                        </div>
                    </div>
            </form>
        </main>
        </>
        
    )

    
}

export default Login
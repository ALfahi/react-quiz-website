import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";// adding extra dot to go up one level back into
// /src/ so that we can go into components. 
import Textbox from "../components/Textbox"; 
import { handleSubmit } from "../javascript/LoginPage";
import "../css/Form.css"
import "../css/Login.css";


function Login(){

    const [usernameOrEmail, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");
    const navigate = useNavigate();
    return(
        <>
        <main>
            <form className = "textboxContainer"onSubmit={async (e) => {
                e.preventDefault(); 
                await handleSubmit(usernameOrEmail, password, setResponse, navigate);
            }}>
                    <Textbox defaultText = "Enter Username or email" required = {true} onChange = 
                    {(e) => setUsername(e.target.value)}></Textbox>
                    <Textbox defaultText = "Enter password" type = "password" required = {true} onChange=
                    {(e) => setPassword(e.target.value) }></Textbox>
                    <div className = "linkAndButton">
                        <Link to = "/ForgottenPassword">
                            <p className = "pageLink">Forgotten Password?</p>
                        </Link>

                        <div className = "enterButton">
                            <Button text = "enter" type = "submit"></Button>
                        </div>
                    </div>
                    <p className = "response">{response}</p>{/* response from back end */}
            </form>
        </main>
        </>
        
    )

    
}

export default Login
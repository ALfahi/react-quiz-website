import {Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/Button";// adding extra dot to go up one level back into
// /src/ so that we can go into components. 
import Textbox from "../components/Textbox"; 
import Spinner from "../components/Spinner"
import { handleSubmit } from "../javascript/LoginPage";
import {useAuth} from "../contexts/AuthContext";
import "../css/Form.css"
import "../css/Login.css";


function Login(){
    const { token, login } = useAuth();
    const [usernameOrEmail, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() =>
        {
            if (token)// redirect sto home page if user is logged in and they try to access this page.
            {
                navigate('/')
            }
        }, [token, navigate])
    return(
        <>
        <main>
            <form className = "textboxContainer"onSubmit={async (e) => {
                e.preventDefault(); 
                await handleSubmit(usernameOrEmail, password, setResponse, navigate, setLoading, login);
            }}>
                    <Textbox defaultText = "Enter Username or email" required = {true} onChange = 
                    {(e) => setUsername(e.target.value)}></Textbox>
                    <Textbox defaultText = "Enter password" type = "password" required = {true} onChange=
                    {(e) => setPassword(e.target.value) }></Textbox>
                    <div className = "linkAndButton">
                        <Link to = "/forgotten-password">
                            <p className = "pageLink">Forgotten Password?</p>
                        </Link>

                        <div className = "enterButton">
                            <Button text = "enter" type = "submit" disabled ={loading}></Button>
                        </div>
                    </div>
                    <p className = "response">{response}</p>{/* response from back end */}
            </form>

            {loading &&<Spinner message="Loading..." />}
        </main>
        </>
        
    )

    
}

export default Login
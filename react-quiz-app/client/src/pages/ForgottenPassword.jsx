import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import { submitForm, redirectToResetPasswordPage} from "../javascript/pages/ForgottenPassword";
// /src/ so that we can go into components. 
import Textbox from "../components/Textbox"; 
import Spinner from "../components/Spinner"   
import "../css/Form.css";
import "../css/Login.css";


function ForgottenPassword(){
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [message, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
            e.preventDefault();
            submitForm(email, setResponse, setLoading); // just pass navigate
          };

    useEffect(() => {
    const query = new URLSearchParams(window.location.hash.split('?')[1]);
    const token = query.get("token");
    if (token) {
        const handleRedirect = async () => {
          await redirectToResetPasswordPage(token, navigate, setResponse, setLoading);
        };
        handleRedirect();
    }
    }, []);

    return(
        <>
        <main>
            <form className = "textboxContainer" onSubmit={handleSubmit}>
                <Textbox type = "email" defaultText = "Enter Email Address" onChange = {(e) => setEmail(e.target.value)} required = {true}/>
                <div className = "enterButton">
                        <button type = "submit" disabled = {loading}>send email</button>
                </div>
            </form>

            {message && (
                <p className = "response">{message}</p>
            )}

            {loading &&<Spinner message="Loading..." />}
        </main>
        </>
    ) 
}

export default ForgottenPassword
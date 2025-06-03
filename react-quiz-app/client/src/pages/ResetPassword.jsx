import {useNavigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
// /src/ so that we can go into components. 
import Textbox from "../components/Textbox"; 
import Spinner from "../components/Spinner"
import ErrorList from "../components/ErrorList"; 
import "../css/Form.css";

import {handlePasswordChange, handleConfirmPasswordChange} from "../javascript/pages/Register.js";
import { hasValidationErrors, submitForm } from "../javascript/pages/ResetPassword.js";


function ResetPassword(){
        const location = useLocation();
        const [password, setPassword] = useState("");
        const [passwordErrors, setPasswordErrors] = useState([]);
        
        const [confirmPassword, setConfirmPassword] = useState("");
        const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);

        const [message, setResponse] = useState("");
        const [loading, setLoading] = useState(false);

        const token = location.state?.token
    
        const navigate = useNavigate();

        useEffect(() => {
            if (!token && !location.state?.justSent) {
                navigate('/');
            }
            }, [token, location.state, navigate]);

        const handleSubmit = (e) => {
            e.preventDefault();
            // get token from url or state or what not to define user form db.
            submitForm(token, password, setResponse, setLoading, navigate); // just pass navigate
            };

        return(
            <>
            <main>
                <form className="textboxContainer"  onSubmit={handleSubmit}>
                    <Textbox type = "password" defaultText = "Enter Password" onChange={(e) =>  
                        handlePasswordChange(e.target.value, setPassword, setPasswordErrors, setConfirmPassword, setConfirmPasswordErrors)} required = {true} />
                    <ErrorList errors = {passwordErrors} color = "red"></ErrorList>
                    
                    <Textbox type = "password" defaultText = "Confirm Password" required = {true} onChange={
                        (e) => handleConfirmPasswordChange(password, e.target.value, setConfirmPassword, setConfirmPasswordErrors)} />
                    <ErrorList errors = {confirmPasswordErrors} color = "red"></ErrorList>
    
    
                    <button type = "submit" disabled = {hasValidationErrors(passwordErrors, confirmPasswordErrors) ||loading}>
                        create new password</button>
                </form>
    
                {message && (
                    <p className = "response">{message}</p>
                )}
    
                {loading &&<Spinner message="Loading..." />}
            </main>
            </>
            
        )
}

export default ResetPassword
import {useNavigate} from "react-router-dom";
import {useState} from "react";
// /src/ so that we can go into components. 
import Textbox from "../components/Textbox"; 
import Spinner from "../components/Spinner"
import ErrorList from "../components/ErrorList"; 
import "../css/Form.css";

import {handlePasswordChange, handleConfirmPasswordChange, handleUsernameChange,
    hasValidationErrors, submitForm} from "../javascript/pages/Register";
function Register()// TO DO: MAKE SURE THAT WE ONLY LIMIT ONE EMAIL PER DATABASE 
// (i.e emails are unique, and one email can only have one account)
{
    const [username, setUsername] = useState("");
    const [usernameErrors, setUsernameErrors] = useState([]);

    const [email, setEmail] = useState("");


    const [password, setPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);

    const [message, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(username, email, password, navigate, setResponse, setLoading); // just pass navigate
      };


    return(
        <>
        <main>
            <form className="textboxContainer"  onSubmit={handleSubmit}>
                <Textbox defaultText = "Enter Username" required = {true} onChange={
                    (e) => handleUsernameChange(e.target.value, setUsername, setUsernameErrors) }/>
                <ErrorList errors = {usernameErrors} color = "red"></ErrorList>

                <Textbox type = "email" defaultText = "Enter Email Address" onChange = {(e) => setEmail(e.target.value)} required = {true}/>

                <Textbox type = "password" defaultText = "Enter Password" onChange={(e) =>  
                    handlePasswordChange(e.target.value, setPassword, setPasswordErrors, setConfirmPassword, setConfirmPasswordErrors)} required = {true} />
                <ErrorList errors = {passwordErrors} color = "red"></ErrorList>
                
                <Textbox type = "password" defaultText = "Confirm Password" required = {true} onChange={
                    (e) => handleConfirmPasswordChange(password, e.target.value, setConfirmPassword, setConfirmPasswordErrors)} />
                <ErrorList errors = {confirmPasswordErrors} color = "red"></ErrorList>


                <button type = "submit" disabled = {hasValidationErrors(usernameErrors, passwordErrors, confirmPasswordErrors) ||loading}>
                    Register</button>
            </form>

            {message && (
                <p className = "response">{message}</p>
            )}

            {loading &&<Spinner message="Loading..." />}
        </main>
        </>
        
    )

    
}

export default Register
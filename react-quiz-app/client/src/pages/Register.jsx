import {useNavigate} from "react-router-dom";
import {useState} from "react";
// /src/ so that we can go into components. 
import Textbox from "../components/Textbox"; 
import ErrorList from "../components/ErrorList"; 
import "../css/Form.css";

import {handlePasswordChange, handleConfirmPasswordChange, handleUsernameChange,
    hasValidationErrors, submitForm} from "../javascript/Register";
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

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(username, email, password, navigate); // just pass navigate
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


                <button type = "submit" disabled = {hasValidationErrors(usernameErrors, passwordErrors, confirmPasswordErrors)}>
                    Register</button>
            </form>
        </main>
        </>
        
    )

    
}

export default Register
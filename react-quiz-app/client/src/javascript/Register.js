import { validateTextLength} from "./Utils";
import { registerUser, doesUserExist, handleApiCallWithFeedback} from "./UserServices";
/************* functions for passwords *********/


// This function just checks if the password and confirm password are the same
// returns boolean
function isSamePassword(password, confirmPassword) {
    return password === confirmPassword;
}

// This function checks if the password and confirm password are the same and returns an array of possible errors (array of strings)

function checkSamePassword(password, confirmPassword){
    const errors = [];

    if (!isSamePassword(password, confirmPassword)) {
        errors.push("Passwords do not match.");
    }

    return errors; // If empty, the passwords match
}

// This function checks if the password is valid, returns an array of possible errors (array of strings)
// valid password must be between 12 and 30 characters long, 
// contain at least one uppercase letter, one lowercase letter, one number, and one special character
function validatePassword(password) {
    const errors = [];
    const MINLENGTH = 12;
    const MAXLENGTH = 30;

    if (password.includes(" ")) {
        errors.push("Password cannot contain spaces.");
    }
    // range check: check if the password is between 12 and 30 characters long
    if (!validateTextLength(password, MINLENGTH, MAXLENGTH)) {
        errors.push(`Password must be between ${MINLENGTH} and ${MAXLENGTH} characters.`);
    }
    // presence check: check if the password contains at least one uppercase letter
    // , one lowercase letter, one number, and one special character
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must include at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must include at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must include at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must include at least one special character.");
    }

    return errors; // If empty, the password is valid
}

// This function handles the password change event, updates the password state, and sets validation errors
//
// Note: Whenever the main password changes, we also need to re-check the confirm password field.
// This is because the user may have already typed a confirm password, and we want to immediately
// notify them if it no longer matches the updated main password.
//
export function handlePasswordChange(password, setPassword, setErrors, confirmPassword,  setConfirmErrors) {
    setPassword(password);// display what user is currently typing inside the field.
    const validationErrors = validatePassword(password);
    setErrors(validationErrors);

    // we need to also re validate against the confirm password field to make sure that they match.
    const confirmPasswordValidationErrors = checkSamePassword(password, confirmPassword);
    setConfirmErrors(confirmPasswordValidationErrors);
}

// This function handles what happens when the field inside the confirm password text field changes.
// it checks if the password field and confirm password field are equal and also it displays what the user is typing
// into the confirm password field.
//
export function handleConfirmPasswordChange(confirmPassword, password, setConfirmPassword, setErrors) {
    setConfirmPassword(confirmPassword);
    const validationErrors = checkSamePassword(password, confirmPassword);
    setErrors(validationErrors);
}

/*********functions for usernames*********/

async function validateUsername(username) {
    let errors = [];
    const TRIMMEDUSERNAME = username.trim();
    // check if username is between 5 and 15 characters long
    const MINLENGTH = 5;
    const MAXLENGTH = 15;  
    const duplicateUser = await doesUserExist(username)
    if (!validateTextLength(TRIMMEDUSERNAME, MINLENGTH, MAXLENGTH)) {
        errors.push(`Username must be between ${MINLENGTH} and ${MAXLENGTH} characters.`);
    }

    if (TRIMMEDUSERNAME !== username) {
        errors.push("Username cannot contain any leading or trailing spaces.");
    }
    // check if username already exists:
    if (duplicateUser)
    {
        errors.push("Username already in use");
    }

    return errors;
}

export async function handleUsernameChange(username, setUsername, setErrors) {
    setUsername(username);
    const validationErrors =await validateUsername(username);
    setErrors(validationErrors);
}

// function to disable the submit button if any of the error still exists.
export function hasValidationErrors(usernameErrors, passwordErrors, confirmPasswordErrors) {
    return (usernameErrors.length > 0 || passwordErrors.length > 0 || confirmPasswordErrors.length > 0);
}

// This function just submits the data into the backEnd via register user which will send an email, it then redirects to the next page
// which will be used to actually show the status of the email.
//
export async function submitForm(
    username, email, password,
    navigate, setMessage, setLoading
  ) {
    await handleApiCallWithFeedback({
      asyncFunc: () => registerUser(username, email, password),
      setMessage,
      setLoading,
      onSuccess: () => {
        navigate('/verify-email', {
          state: {
            justSent: true,
            username,
            email,
          }
        });
      },
      errorMessage: "Failed to register user, please try again.",
    });
  }
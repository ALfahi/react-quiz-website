import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshLoginToken } from "./UserServices";
import { logoutUser } from "./StorageUtils";

// global variables
let showWarningTimeoutId = null;// timer to keep track of when to show the pop uop
let countdownIntervalId = null;// count down telling user exaclty when they are about to be logged out.
let isLoginWarningActive = false;// an extra safe gaurd to stop multiple show pop ups appearing e.g.
                                // when user logs in, and logs in again as they are still logged in (won't be an issue in
                                // real life scenerio as I would redirect them automatically, but this safegaurd is still
                                // useful as a back up.)

// Clears the warning timer and countdown interval
//
function clearLoginTimers() {
    if (showWarningTimeoutId !== null) 
    {
        clearTimeout(showWarningTimeoutId);
        showWarningTimeoutId = null;
    }
    if (countdownIntervalId !== null) 
    {
        clearInterval(countdownIntervalId);
    }
}

// updates the countdown to show exactly when the user is about to be logged out:
//
function updateCountdown(setCountdown,dialogRef, tokenExpiryTime){
    const remaining = Math.max(Math.floor((tokenExpiryTime - Date.now()) / 1000), 0);
    setCountdown(remaining);
    if (remaining <= 0) // also automarically close the pop up when timer ends.
    {
        closeLoginWarning(setCountdown, dialogRef);

    }
};

// Shows the warning dialog
//
function showWarningDialog(dialogRef,setCountdown, tokenExpiryTime) 
{
    if (dialogRef.current)
    {
        dialogRef.current.showModal();
    }
    updateCountdown(setCountdown, dialogRef, tokenExpiryTime); // make sure to update the countdown.
    countdownIntervalId = setInterval(() => {
        updateCountdown(setCountdown, dialogRef, tokenExpiryTime);
      }, 1000);
    }

// Set the timer for warning based on JWT expiration
//
function setupLoginTimers(exp, dialogRef, setCountdown) {
    clearLoginTimers();

    const currentTime = Date.now();
    const tokenExpiryTime = exp * 1000;
    const timeBeforeWarning = 5 * 60 * 1000; // 5 minutes
    const timeUntilWarning = tokenExpiryTime - currentTime - timeBeforeWarning;

    if (timeUntilWarning > 0) 
    {
        showWarningTimeoutId = setTimeout(() =>
        showWarningDialog(dialogRef, setCountdown, tokenExpiryTime), timeUntilWarning);
    } 
    else 
    {
        showWarningDialog(dialogRef, setCountdown, tokenExpiryTime);
    }
}

// Refreshes token and hides the dialog element
//
async function renewLogin(setMessage, setCountdown, dialogRef) {
  try {
        await refreshLoginToken();
        isLoginWarningActive = false;
        setMessage("login session is successfully renewed.")
        setTimeout(() =>  {
            closeLoginWarning(setCountdown, dialogRef);
            setMessage("");
             // re initialise the timers so the pop up appears the next time the user is about to be logged out
            initialiseLoginWarning(dialogRef, setCountdown);

        }, 1000)
  } 
  catch (error) 
  {
        console.error("Token refresh failed", error);
        setMessage("failed to renew login session, please login manually.")
        setTimeout(() => {
            closeLoginWarning(setCountdown, dialogRef);
            setMessage(""); // Optional: reset message
          }, 1000);
  }
}

// Closes the warning dialog manually
//
function closeLoginWarning(setCountdown, dialogRef) 
{
    if (dialogRef.current) 
    {
        dialogRef.current.close();
    }
    setCountdown(null);
    isLoginWarningActive = false;
    clearLoginTimers();
}

// Hook to initialise login warning logic
//
function initialiseLoginWarning(dialogRef, setCountdown) {

    if (isLoginWarningActive) // prevents multiple pop ups to appear.
    {
        console.warn("LoginWarning already initialised");
        return;
    }

    const token = localStorage.getItem("user token");
    if (!token)
    {
        isLoginWarningActive = false;
        return;
    }

    let decoded;
    let expirationTime;
    try 
    {
        decoded = jwtDecode(token);
        expirationTime = decoded.exp * 1000;
        if (expirationTime <= Date.now())// if user closes tab or window or refreshes before token naturally expired, we check it here.
        {
            logoutUser();
            return;
        }

    } 
    catch (error)
    {
        console.error("Invalid token");
        return;
    }

    if (decoded && decoded.exp)
    {
        isLoginWarningActive = true;
        setupLoginTimers(decoded.exp, dialogRef, setCountdown);
    }
}



// Exported hook
//
export function useLoginWarning()
{
    const [countdown, setCountdown] = useState(null);
    const [message, setMessage] = useState("");
    const dialogRef = useRef(null);
    useEffect(() => {
        // intialise the mounting of the LoginWarning component
        initialiseLoginWarning(dialogRef, setCountdown);
      
        // add a wrappee function to unmount and remount the component whenever the user logs in i.e. the token in local storage change.
        function handleTokenChange() {
          initialiseLoginWarning(dialogRef, setCountdown);
        }
      
        window.addEventListener("tokenChanged", handleTokenChange);
      
        return () => {
            // clean up.
            closeLoginWarning(setCountdown, dialogRef)
            window.removeEventListener("tokenChanged", handleTokenChange);
        };
      }, []);

      return {message,countdown,dialogRef,renewLogin: () => renewLogin(setMessage, setCountdown, dialogRef),
         closeLoginWarning: () => closeLoginWarning(setCountdown, dialogRef),};
    
}

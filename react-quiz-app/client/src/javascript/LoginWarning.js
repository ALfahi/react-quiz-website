import { useEffect, useRef, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { refreshLoginToken } from "./UserServices";
import { useAuth } from "../contexts/AuthContext"; // get logout from context
// global variables
let showWarningTimeoutId = null; // timer to keep track of when to show the pop up
let countdownIntervalId = null; // count down telling user exactly when they are about to be logged out.
let isLoginWarningActive = false; // an extra safe guard to stop multiple show pop ups appearing e.g.
// when user logs in, and logs in again as they are still logged in (won't be an issue in
// real life scenario as I would redirect them automatically, but this safeguard is still
// useful as a back up.)

// Clears the warning timer and countdown interval
//
function clearLoginTimers() {
  if (showWarningTimeoutId !== null) {
    clearTimeout(showWarningTimeoutId);
    showWarningTimeoutId = null;
  }
  if (countdownIntervalId !== null) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
}

// updates the countdown to show exactly when the user is about to be logged out:
//
function updateCountdown(setCountdown, dialogRef, tokenExpiryTime, logout) {
  const remaining = Math.max(Math.floor((tokenExpiryTime - Date.now()) / 1000), 0);
  setCountdown(remaining);
  if (remaining <= 0) {
    // also automatically close the pop up when timer ends.
    closeLoginWarning(setCountdown, dialogRef);
    logout(); // auto logout when token expires
  }
}

// Shows the warning dialog
//
function showWarningDialog(dialogRef, setCountdown, tokenExpiryTime, logout) {
  if (dialogRef.current) {
    dialogRef.current.showModal();
  }
  updateCountdown(setCountdown, dialogRef, tokenExpiryTime, logout); // make sure to update the countdown.
  countdownIntervalId = setInterval(() => {
    updateCountdown(setCountdown, dialogRef, tokenExpiryTime, logout);
  }, 1000);
}

// Set the timer for warning based on JWT expiration
//
function setupLoginTimers(exp, dialogRef, setCountdown, logout) {
  clearLoginTimers();

  const currentTime = Date.now();
  const tokenExpiryTime = exp * 1000;
  const timeBeforeWarning = 5 * 60 * 1000; // 5 minutes
  const timeUntilWarning = tokenExpiryTime - currentTime - timeBeforeWarning;

  if (timeUntilWarning > 0) {
    showWarningTimeoutId = setTimeout(() =>
      showWarningDialog(dialogRef, setCountdown, tokenExpiryTime, logout), timeUntilWarning);
  } else {
    showWarningDialog(dialogRef, setCountdown, tokenExpiryTime, logout);
  }
}

// Refreshes token and hides the dialog element
//
async function renewLogin(setMessage, setCountdown, dialogRef, login, logout) {
  try {
    const newToken = await refreshLoginToken();
    // use the authContext to safley add in the new token.
    login(newToken);

    isLoginWarningActive = false;
    setMessage("login session is successfully renewed.");

    setTimeout(() => {
      closeLoginWarning(setCountdown, dialogRef);
      setMessage("");
      // re initialise the timers so the pop up appears the next time the user is about to be logged out
      initialiseLoginWarning(newToken, dialogRef, setCountdown, logout);
    }, 1000);
  } catch (error) {
    console.error("Token refresh failed", error);
    setMessage("failed to renew login session, please login manually.");
    setTimeout(() => {
      closeLoginWarning(setCountdown, dialogRef);
      setMessage(""); // Optional: reset message
    }, 1000);
  }
}

// Closes the warning dialog manually
//
function closeLoginWarning(setCountdown, dialogRef) {
  if (dialogRef.current) {
    dialogRef.current.close();
  }
  setCountdown(null);
  isLoginWarningActive = false;
  clearLoginTimers();
}

// Hook to initialise login warning logic
//
function initialiseLoginWarning(token, dialogRef, setCountdown, logout) {
    if (isLoginWarningActive) // prevents multiple pop ups to appear.
    {
      console.warn("LoginWarning already initialised");
      return;
    }
  
    if (!token) {
      isLoginWarningActive = false;
      return;
    }
  
    let decoded;
    let expirationTime;
    try {
      decoded = jwtDecode(token);
      expirationTime = decoded.exp * 1000;
      if (expirationTime <= Date.now()) // if user closes tab or refreshes before token naturally expired, we check it here.
      {
        logout(); // make sure context updates on invalid token
        return;
      }
    } catch (error) {
      console.error("Invalid token");
      return;
    }
  
    if (decoded && decoded.exp) {
      isLoginWarningActive = true;
      setupLoginTimers(decoded.exp, dialogRef, setCountdown, logout);
    }
  }
  
  // Exported hook
  //
  export function useLoginWarning() {
    const { logout, login, token } = useAuth();
    const [countdown, setCountdown] = useState(null);
    const [message, setMessage] = useState("");
    const dialogRef = useRef(null);
  
    useEffect(() => {
      // initialise the mounting of the LoginWarning component
      initialiseLoginWarning(token, dialogRef, setCountdown, logout);
  
      // whenever the token changes (user logs in/out), re-initialize timers
    }, [token, logout]);
  
    return {message,countdown,dialogRef,
        renewLogin: () => renewLogin(setMessage, setCountdown, dialogRef, login, logout),
        closeLoginWarning: () => closeLoginWarning(setCountdown, dialogRef),};
  }
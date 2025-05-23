/****** This file is here to handle all local/ session storage handling logic. */
import { jwtDecode } from "jwt-decode";

// This function stores a jwt token into local storage, also adds in a time limit to token is automarically deleted.
//
export function storeUserToken(token) {
    const decoded = jwtDecode(token);
    const tokenExpirationTime = decoded.exp * 1000; // ms
    localStorage.setItem("user token", token);
    window.dispatchEvent(new Event("tokenChanged"));// adding in a custom event so the warning can show up whenever it's needed.
  
    const delay = tokenExpirationTime - Date.now();
  
    if (delay <= 0) // fixing up some edge cases
    {
      logoutUser();
    } 
    else 
    {
      // auto delete the token from local storage when the token is expired.
      setTimeout(() => {
        logoutUser();
      }, delay);
    }
  }

// This function just logs the user out by removing the token from local storage and redirecting to the quiz menu.
//
export function logoutUser()
{
    localStorage.removeItem("user token");// the back end or something else automatically redirects user to a non protected page.
    window.dispatchEvent(new Event("tokenChanged"));
}
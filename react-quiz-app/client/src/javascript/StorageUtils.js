/****** This file is here to handle all local/ session storage handling logic. */
//import jwt_decode from 'jwt-decode';

// This function stores a jwt token into local storage, also adds in a time limit to token is automarically deleted.
//
export function storeUserToken(token)// TO DO: remind user to relogin if they are using website right before it expires. (pop up)
{
    const decoded = jwt_decode(token);
    const tokenExpirationTime = decoded.exp * 1000;//converting into milliseconds.
    localStorage.setItem("user token", token);
        // auto delete the token from local storage when token expires.
        setTimeout(() => { localStorage.removeItem("user token");}, tokenExpirationTime);
}
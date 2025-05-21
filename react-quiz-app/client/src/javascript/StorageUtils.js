/****** This file is here to handle all local/ session storage handling logic. */


// This function stores a jwt token into local storage, also adds in a time limit to token is automarically deleted.
//
export function storeUserToken(token)// TO DO: remind user to relogin if they are using website right before it expires. (pop up)
{
    localStorage.setItem("user token", token);
        // auto delete the token after 12 hours
        setTimeout(() => { localStorage.removeItem("user token");}, 60 * 60 * 12);
}
/*
This file contains all the functions which connects my front end code to my back end code.
*/

// This function gets the username, password and email from the front end and then creates a new user in the backend database.
// returns a boolean value of whether or not the user was successfully created in the database or not.
//
export async function registerUser(username, email, password)
{

    try{
        const response = await fetch('http://localhost:3001/api/users/sendVerificationEmail', 
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

       return response
    }
    catch(err)
    {
        console.log(err);
        return null;

    }
    
    
}

// This function just checks that if the passed in username already exists in the database. (returns a boolean value)
//
export async function doesUserExist(username)
{
    try{
        const response = await fetch('http://localhost:3001/api/users/isDuplicateUser', 
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username,})
        });
    
        const data =await response.json();
        if (response.ok)
        {
            return data.exists;// boolean representing is user exists in database.
        }
        else
        {
            console.log("errer when checking is username is correct or not")
        }
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

// This function just resends the verification email when the user wants to activate their account
//
export async function resendVerificationEmail(username, email)
{
    try{
        console.log(username, email);
        const response = await fetch('http://localhost:3001/api/users/resendVerificationEmail', 
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, email})
        });
    
        await response.json();
    }
    catch(err)
    {
        console.log(err);
    }
}

// This function sends the values that the user typed into the text fields back into backend for authorisation.
//
export async function handleUserLogin(usernameOrEmail, password)
{
    try{
        const response = await fetch('http://localhost:3001/api/users/login',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({usernameOrEmail, password})
        });
    
       return response;
    }
    catch(error)
    {
        console.log(error);
    }
}
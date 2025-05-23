/*
This file contains all the functions which connects my front end code to my back end code.
*/

import { storeUserToken } from "./StorageUtils";
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
export async function resendVerificationEmail(username, email, setLoading)
{
    try{

        setLoading(true)
        const response = await fetch('http://localhost:3001/api/users/resendVerificationEmail', 
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, email})
        });
    
        await response.json();
        setLoading(false)
    }
    catch(err)
    {
        console.log(err);
        setLoading(false);
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

// This function sends the old token to the back end for it to be renewed.
//
export async function refreshLoginToken()
{
    const token = localStorage.getItem("user token");
    if (!token)// if token is missing or expired just do nothing (user will need to have login normally.)
    {
        return
    }
    const response = await fetch("http://localhost:3001/api/users/refreshLogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (response.ok)
    {
        storeUserToken(data.token);
    }

}
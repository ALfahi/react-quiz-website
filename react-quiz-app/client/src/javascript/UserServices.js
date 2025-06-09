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
        return null
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
        return data.token || null
    }
    return null;

}

//This function is used to send an email for the user to reset their password when they have forgotten their password.
//
export async function sendResetPasswordEmail(email)
{
    const response = await fetch("http://localhost:3001/api/users/sendResetPasswordEmail", {
        method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email})
    });

    return response

}

// This function gets a token and validates it for the reset password call.
//
export async function validateResetPasswordToken(token) {
    const response = await fetch(`http://localhost:3001/api/users/verifyPasswordReset?token=${token}`, {
        method: 'GET'
    });

    return response;
}

// This function just gets a token and a password and then sends it to the back end so they can update the database
// or tell front end of any errors e.g. token expired.
//
export async function resetPassword(token, newPassword)
{
    const response = await fetch("http://localhost:3001/api/users/resetPassword", {
        method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({token, newPassword})
    });

    return response;
}




// This general function is used to perform api calls to the back end and then also display the responses to front end
// and also navigate to other pages if needed (e.g. used in login, forgotten password, etc etc)
//
export async function handleApiCallWithFeedback({
    asyncFunc,// the api call that we are calling (all of them is going to be async e.g. await response.)
    setMessage,
    setLoading,// loading flag to show the spinner for when an api call is being made
    successMessage,
    errorMessage = "An error has occurred, please try again.",
    onSuccess,// optional function that runs when the response was successful.
    onError,// optional function to run when response was not successfull.
    navigateTo,// desitination page.
    navigate,// useNavigate object.
    navigateState = {},  // adds flexability for when you want to add in states before moving onto next page.
    redirectDelay = 1000,// 1 second
    }) {
        try {
        // set up the loading flags to disable submit button on pages and display the spinner.
        setLoading(true);
        const response = await asyncFunc();
        setLoading(false);
    
        if (!response) {
            setMessage(errorMessage);
            return;
        }
    
        const data = await response.json();
    
        if (response.ok) {
            setMessage(data.message || successMessage);
    
            if (onSuccess) onSuccess(data);// run extra function here if needed.
    
            if (navigate && navigateTo) {
            setLoading(true);
            // redirect to page after a success.
            setTimeout(() => {
                navigate(navigateTo, { state: navigateState });
                // clean up
                setLoading(false);
                setMessage("");
            }, redirectDelay);
            }
            return;
        }
        else {
            // Allow custom handling of errors
            if (onError) {
              onError(response.status, data);
            }
            setMessage(data.message || errorMessage);
          }
    
        setMessage(data.message || errorMessage);
        } catch (error) {
        console.error(error);
        setLoading(false);
        setMessage(errorMessage);
        }
    }

    /******************* Quiz routes ************/

// This function is used to connect the front end to the back end when creating a new quiz in the database.
// since an image banner may exist for the quiz, we want to pass in formData.
//
export async function createQuiz(formData, token)
{
    const response = await fetch("http://localhost:3001/api/quizzes/createQuiz",{
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}` // attatch token so we can verify it in back end.
    },
    body: formData,
    })

    return response;
}

// This general function is used to query and get quizzes from the back end.
//
export async function getQuizzes({ sourcePage, title, createdBy, status, isPublic, id }, token) {
    // Build query params string
    const params = new URLSearchParams();
    if (sourcePage) params.append('sourcePage', sourcePage)
    if (title) params.append('title', title);
    if (createdBy) params.append('createdBy', createdBy);
    if (status) params.append('status', status);
    if (typeof isPublic === 'boolean') params.append('isPublic', isPublic);
    if (id) params.append('id', id);
  
    const url = `http://localhost:3001/api/quizzes/getQuizzes?${params.toString()}`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}` // attach token so backend can verify it
      },
    });
  
    return response;
  }

  // This function will be used to connect to the database and change a quizzes status e.g. pending is changed into rejected or approved.
  //
  export async function changeQuizStatus(isQuizAccepted, rejectedReason, quizId, token)
  {
    const response = await fetch("http://localhost:3001/api/quizzes/updateQuizStatus", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({isQuizAccepted, rejectedReason, quizId})
    });

    return response;
  }

  // This function connects to the back end and deletes a quiz from the database and also removes all associated files from the server.
  //
  export async function deleteQuiz(quizId, token)
  {
    const response = await fetch("http://localhost:3001/api/quizzes/deleteQuiz", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quizId})
    });

    return response;
  }
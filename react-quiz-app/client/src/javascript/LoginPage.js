
import { storeUserToken } from "./StorageUtils";
import { handleUserLogin } from "./UserServices";
// This function just checks if user was inputted in correct information to the login form, if so then redirect to the quiz menu page
// otherwise do nothing
// it also displays the back end message to the front end.
//
export async function handleSubmit(usernameOrEmail, password, setMessage, navigate)
{
    const response = await handleUserLogin(usernameOrEmail, password);
    if (!response)// response is somehow null
    {
        setMessage("something has went wrong, please try again");
        return
    }
    const data =  await response.json();
    if (response.ok)
    {
        storeUserToken(data.token);
        // redirect to the quiz menu page
        setTimeout(() => {
            navigate('/QuizMenu');
        }, 3000);
        
    }
    setMessage(data.message);// display the message from back end to client side.
}
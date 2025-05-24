import { sendResetPasswordEmail, validateResetPasswordToken, handleApiCallWithFeedback} from "./UserServices";
// This function just sends the email to the back end which will be used to verify that the user owns the email.
//
export async function submitForm(email, setMessage, setLoading) 
{
   setMessage("");// make sure that we clear any existing messages before executing rest of the function.
   setLoading(true);
   const response = await sendResetPasswordEmail(email);
   setLoading(false);
   if(!response)
   {
        setMessage("something went wrong");
        return;
   }
   const data = await response.json()
   setMessage(data.message)// for this submit form we don't care if the response was a success or not (that's for another function to figure out).
}

//This function redirects user to the reset password page if the token has been successfully verified.
//
export async function redirectToResetPasswordPage(token, navigate, setMessage, setLoading)
{
   await handleApiCallWithFeedback({
   asyncFunc: () => validateResetPasswordToken(token),
   setMessage,
   setLoading,
   successMessage: "Token verified. Redirecting...",
   onSuccess: () => {// using onSuccess here to add in the navigate state.
      setLoading(true);
      setTimeout(() => {
      navigate("/ResetPassword", {
         state: {
            token: token,
            justSent: true,
         }
      });
      setMessage("");
      setLoading(false);
      }, 1000);
   }
});
}


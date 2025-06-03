import { handleApiCallWithFeedback, handleUserLogin } from "../UserServices";
// This function just checks if user was inputted in correct information to the login form, if so then redirect to the quiz menu page
// otherwise do nothing
// it also displays the back end message to the front end.
//
export async function handleSubmit(usernameOrEmail, password, setMessage, navigate, setLoading, login) {
    await handleApiCallWithFeedback({
      asyncFunc: () => handleUserLogin(usernameOrEmail, password),
      setMessage,
      setLoading,
      successMessage: "Logged in successfully, redirecting...",
      onSuccess: (data) => {
        login(data.token);  // you now get the `data` here, so you can access `data.token`
      },
      navigateTo: '/quiz-menu',
      navigate,
    });
  }
  
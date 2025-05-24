import { resetPassword, handleApiCallWithFeedback } from "./UserServices";

export function hasValidationErrors(passwordErrors, confirmPasswordErrors)
{
    return (passwordErrors.length > 0 || confirmPasswordErrors.length > 0);
}

export async function submitForm(token, password, setMessage, setLoading, navigate) {
    await handleApiCallWithFeedback({
      asyncFunc: () => resetPassword(token, password),
      setMessage,
      setLoading,
      successMessage: "Password reset successful, redirecting...",
      navigateTo: "/Login",
      navigate,
      redirectDelay: 1000,
    });
  }
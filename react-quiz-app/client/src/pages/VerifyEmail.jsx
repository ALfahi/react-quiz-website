import { useVerifyEmail } from "../javascript/VerifyEmailPage";
import { resendVerificationEmail } from "../javascript/UserServices";

function VerifyEmailPage()
{
    let {message, email, username} = useVerifyEmail();
    return (
        <section>
            <p className="response">{message}</p>{/* response from back end */}
            <form>
            <p>can't find the email? click the button to resend the email to {email}</p>
            <button type = "button" onClick = {()=> resendVerificationEmail(username, email)}>resend email</button>
            </form>
        </section>
    );
}

export default VerifyEmailPage;

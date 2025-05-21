import { useVerifyEmail } from "../javascript/VerifyEmailPage";
import { useState } from "react";
import { resendVerificationEmail } from "../javascript/UserServices";
import Spinner from "../components/Spinner"

function VerifyEmailPage()
{
    let {message, email, username} = useVerifyEmail();
    const [loading, setLoading] = useState(false);
    return (
        <section>
            <p className="response">{message}</p>{/* response from back end */}
            <form>
            <p>can't find the email? click the button to resend the email to {email}</p>
            <button type = "button" onClick = {()=> resendVerificationEmail(username, email, setLoading)} disabled = {loading}>
                resend email</button>
            </form>
            {loading &&<Spinner message="sending email..." />}
        </section>
    );
}

export default VerifyEmailPage;

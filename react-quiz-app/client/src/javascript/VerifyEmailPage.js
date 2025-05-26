// This file contains all the js used for the verifyEmailPage:

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// This function is used for the main bulk of the verifyEmail page, it allows the page to display different messages depending on
// the status of the email e.g. (tells user that an email has been sent, tells user if account creation was successful/ unsuccessful)
// etc.
// This is a hook
export function useVerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const hasVerified = useRef(false);
    const [email, setEmail] = useState(location.state?.email || null);
    const [username, setUsername] = useState(location.state?.username || null);
    const [message, setMessage] = useState("Verification email sent. Please check your spam if you didn't see the email.");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token && !location.state?.justSent) {
            navigate('/');
            return;
        }

        if (token && !hasVerified.current) {
            hasVerified.current = true;

            const verifyEmail = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/users/verifyEmail?token=${token}`);
                    const data = await response.json();
                    setMessage(data.message);

                    // Save email and username from response into state
                    if (data.email) {
                        setEmail(data.email);
                    }

                    if (data.username){
                        setUsername(data.username);
                    }


                    window.history.replaceState({}, '', '/verify-email');

                    if (response.ok) {
                        setTimeout(() => {
                            navigate('/login');
                        }, 5000);
                    }

                } catch (error) {
                    console.error('Error verifying email:', error);
                    setMessage("Something went wrong during verification.");
                }
            };

            verifyEmail();
        }
    }, [location.search, navigate]);

    return { message, email, username };
}

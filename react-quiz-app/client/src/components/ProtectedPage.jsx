
// This component is a wrapper for pages of the website which checks if user is admin or logged in and redirects to a different page
// if the user does not have valid credentials to be visiting the page.
// attributes: 
// - page: what page this function is wrapping over
// - admin: boolean, if the user must be an admin to access this page.

import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from './Spinner';

// This component is a wrapper for protected pages. It checks login/admin status.
function ProtectedPage({ page, admin = false}) {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [allowed, setAllowed] = useState(null); // null = loading.

    useEffect(() => {

        // If user is not logged in, or user is logged in but is not admin in an admin level page.
        if (!token || (admin && user?.admin !== 'admin')) {
            navigate('/login');
            return;
        }

        // Passed all checks
        setAllowed(true);
    }, [token, user, admin, navigate]);

    // Loading or redirecting — don’t show page yet
    if (allowed === null)
    {
        return <Spinner message = "loading..." />
    }
    return page;//it passed all the checks, return the page.
}

export default ProtectedPage;
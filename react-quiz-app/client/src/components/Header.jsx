import {useLocation} from "react-router-dom"
import "../css/Header.css"
import Menu from "../components/Menu"
import UserIcon from "../components/UserIcon"
function Header(){
    const location = useLocation()// get current web page path.
    
    // Map paths to page names so header dynamically adds current page title.
    const pageTitles = {
        "/": "Home",
        "/login": "Login",
        "/register": "Register",
        "/forgotten-password": "Forgotten Password",
        "/change-email": "Change Email",
        "/quiz-menu": "Quiz Menu",
        "/your-quiz": "Your Quizzes",
        "/quiz-status": "Quiz Status",
        "/create-quiz": "Create  Quiz",
        "/pending-quiz": "Pending Quizzes",
        "/build-quiz": "Quiz Builder",
        "/verify-email": "Verify Email",
        "/reset-password": "Reset Password",
    };

    // Get the current page title, or show "Page Not Found" if unknown
    const currentPage = pageTitles[location.pathname] || "Page Not Found";

    // also add in user icon and menu icon before adding in the current page title
    return(
        <>
        <header className = "stickyHeader">
            <Menu className = "menu"></Menu>
            <h3 className = "websiteName">Quiz website Name</h3>
            <h2 className = "currentTitle">{currentPage}</h2>
            <UserIcon className = "userIcon"></UserIcon>
        </header>
        </>
    

    );
}
export default Header
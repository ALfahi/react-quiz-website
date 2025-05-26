import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/UserIcon.css";

import profilePicture from "../assets/defaultPfp.jpg";
import { useAuth } from "../contexts/AuthContext"
function UserIcon() {
    const {user, logout} = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const userIconRef = useRef(null);
    const userSidebarRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    //TO DO: MMOVE THE LOGIC INTO A SEPERATE FILE.

    // Close the menu if the user clicks outside of the icon or the menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userIconRef.current && !userIconRef.current.contains(event.target) &&
                userSidebarRef.current && !userSidebarRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        // Adding event listener to document
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="userIcon" onClick={toggleMenu} ref={userIconRef}>
                <img src={profilePicture} alt="profile menu" />
            </div>
            <section className={`userSidebar ${isOpen ? "open" : ""}`} ref={userSidebarRef}>
                {user && (
                        <>
                            <button onClick = {logout}>Log Out</button>
                            <Link to = "/change-email">
                                <h3>Change Account Email</h3>
                            </Link>
                            <Link to = "/quiz-status">
                                <h3>Quiz Status</h3>
                            </Link>
                            <Link to = "/your-quiz">
                                <h3>Your Quizzes</h3>
                            </Link>
                            <Link to = "pending-quiz">
                                <h3>Pending Quizzes</h3>
                            </Link>
                            {/* fill in admin links here */}
                            {(user?.admin == 'admin') &&(
                                <>
                                </>
                            )}
                        </>
                )
                }
                {
                    !user &&(
                        <>
                            <Link to = "/login">
                                <h3>Login</h3>
                            </Link>
                            <Link to = "/register">
                                <h3>Register</h3>
                            </Link>
                        </>
                    )
                
                }
                
            </section>
        </>
    );
}

export default UserIcon;

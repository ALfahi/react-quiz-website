import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/UserIcon.css";

import profilePicture from "../assets/defaultPfp.jpg";

function UserIcon() {
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
                <h3>Log Out</h3>

                <Link to = "/ChangeEmail">
                    <h3>Change Account Email</h3>
                </Link>
                <Link to = "/QuizStatus">
                    <h3>Quiz Status</h3>
                </Link>
                <Link to = "/YourQuiz">
                    <h3>Your Quizzes</h3>
                </Link>
                <Link to = "PendingQuiz">
                    <h3>Pending Quizzes</h3>
                </Link>
            </section>
        </>
    );
}

export default UserIcon;

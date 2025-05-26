import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/Menu.css";
import hamburgerIcon from "../assets/hamburgerButton.png";

function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuIconRef = useRef(null);
    const sideBarRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close the menu if the user clicks outside of the menu or the icon
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuIconRef.current && !menuIconRef.current.contains(event.target) &&
                sideBarRef.current && !sideBarRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        // Add event listener to document
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="menuIcon" onClick={toggleMenu} ref={menuIconRef}>
                <img src={hamburgerIcon} alt="Menu" />
            </div>
            <section className={`sideBar ${isOpen ? "open" : ""}`} ref={sideBarRef}>
                <Link to="/">
                    <h3>Home</h3>
                </Link>
                <Link to="/login">
                    <h3>Login</h3>
                </Link>
                <Link to="/quiz-menu">
                    <h3>Quizzes</h3>
                </Link>
            </section>
        </>
    );
}

export default Menu;

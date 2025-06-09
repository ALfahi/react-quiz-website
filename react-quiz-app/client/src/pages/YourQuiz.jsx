import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApprovedQuizzes } from "../javascript/pages/YourQuiz.js";
import {deleteSelectedQuiz, showConfirmationPopUp } from "../javascript/pages/QuizStatus.js";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import QuizTable from "../components/QuizTables";
import { useAuth } from "../contexts/AuthContext";

import '../css/YourQuiz.css'; 

function YourQuiz() {
    const { token } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {// on mount just show all approved quizzes
        const fetchData = async () => {
            await fetchApprovedQuizzes(token, setResponse, setLoading, setQuizzes);
        };

        // Refresh when page becomes visible
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchData();
            }
        };

        fetchData();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [token]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading) {
                fetchYourApprovedQuizzes(token, setResponse, setLoading, setQuizzes);
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [token, loading]);

    if (loading) return <Spinner message="Loading your quizzes..." />;

    return (
        <>
            <main>
                <div className="pageContainer">
                    <section>
                        <QuizTable quizzes = {quizzes} columns = {["title", "stats" ,"delete"]} actionComponents = {[null, 
                            (quiz) => <button type = "button">stats </button>,/* place holder */
                            (quiz) => <button type = "button" className = "deleteQuizButton" onClick = 
                            {() => showConfirmationPopUp(quiz, setSelectedQuiz, setShowConfirmModal)}>Delete</button>,
                        ]}/>
                    </section>

                    <aside>{/* we want to put this right next to the quiz table */}
                        <Link to = "../create-quiz">
                            <Button text = "create quiz"></Button>
                        </Link>
                    </aside>
                </div>

                <p className = "response">{response}</p>{/* response from back end */}

                 {/* show the pop up whenever admin tries to change a quiz status */}
                 {showConfirmModal && (
                    <div className="modalBackdrop">
                        <div className="modal">
                            <h2>Confirm deletion</h2>
                            <p>Are you sure you want to delete the quiz <strong>{selectedQuiz.title}</strong>? (you can't undo this process)</p>

                            <div className="modalActions">
                                <button type = "button" onClick={() => setShowConfirmModal(false)}>Cancel</button>

                                <button  type = "button" onClick={async () => deleteSelectedQuiz(selectedQuiz._id, token, setShowConfirmModal, 
                                setSelectedQuiz, setResponse, setLoading, setQuizzes)}>Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

export default YourQuiz;

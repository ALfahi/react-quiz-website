import { useState, useEffect } from "react";
import { fetchQuizStatuses, deleteSelectedQuiz, showConfirmationPopUp } from "../javascript/pages/QuizStatus"
import Spinner from "../components/Spinner";
import QuizTable from "../components/QuizTables";
import Status from "../components/Status";
import { useAuth } from "../contexts/AuthContext";

import "../css/Modal.css";
function QuizStatus(){
    const {token} = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {/* on mount just show all pending, rejected and recently approved quizzes */
        const fetchData = async () => {
            await fetchQuizStatuses(token, setResponse, setLoading, setQuizzes);
        };

        // forcing react to fetch new data whenever this page becomes visible as to get fresh data.
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
    
    // creating a use effect to auto refresh the page to always get the most up to date set of data:
    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading) {
                fetchQuizStatuses(token, setResponse, setLoading, setQuizzes);
            }
        }, 60 * 1000); // 1 minute interval
    
        return () => clearInterval(interval);
    }, [token, loading]);

    if (loading) return <Spinner message="Loading..." />;
    return (
        <>
            <main>
                <div>
                    <QuizTable quizzes = {quizzes} columns = {["title", "status" ,"delete"]} actionComponents = {[null, 
                         (quiz) => <Status status = {quiz.status}/>,
                         (quiz) => <button type = "button" className = "deleteQuizButton" onClick = 
                         {() => showConfirmationPopUp(quiz, setSelectedQuiz, setShowConfirmModal)}>Delete</button>,
                    ]}/>
                    <p className = "response">{response}</p>{/* response from back end */}
                </div>

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

export default QuizStatus
import {useEffect, useState} from 'react';
import { fetchPendingQuizzes, handleConfirmAction, showConfirmationPopUp} from '../javascript/pages/PendingQuiz';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';
import Status from '../components/Status';
import QuizTable from '../components/QuizTables';

import "../css/PendingQuiz.css";
function PendingQuiz(){
    const {token} = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    // states needed to show confirmation dialogs for a better ux.
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {/* on mount just show all pending quizzes */
        const fetchData = async () => {
            await fetchPendingQuizzes(token, setResponse, setLoading, setQuizzes);
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
                fetchPendingQuizzes(token, setResponse, setLoading, setQuizzes);
            }
        }, 60 * 1000); // 1 minute interval
    
        return () => clearInterval(interval);
    }, [token, loading]);

    if (loading) return <Spinner message="Loading..." />;
    return (
        <>
            <main>
                <div>{/* probs turn this into a html table */}
                    <QuizTable quizzes = {quizzes} columns = {["title","creator", "banner image", "accept", "reject", "status"]}
                    actionComponents = {[null, null, null,  
                        (quiz) => <button type = "button" onClick={() => 
                            showConfirmationPopUp(quiz, true, setSelectedQuiz, setIsRejecting, setShowConfirmModal)}
                            className = "acceptButton">✔</button>,

                        (quiz) => <button type = "button" onClick={() => 
                            showConfirmationPopUp(quiz, false, setSelectedQuiz, setIsRejecting, setShowConfirmModal)} 
                            className = "rejectButton">✖</button>,

                        (quiz) => <Status status = {quiz.status}/>,
                    ]}/>
                    <p className = "response">{response}</p>{/* response from back end */}
                </div>

                {/* show the pop up whenever admin tries to change a quiz status */}
                {showConfirmModal && (
                    <div className="modalBackdrop">
                        <div className="modal">
                        <h2>{isRejecting ? 'Reject Quiz' : 'Accept Quiz'} Confirmation</h2>
                        <p>Are you sure you want to {isRejecting ? 'reject' : 'accept'} the quiz <strong>{selectedQuiz.title}</strong>?</p>

                        {isRejecting && (
                            <>
                            <label htmlFor="rejectionReason">Rejection Reason:</label>
                            <textarea
                                id="rejectionReason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter reason of rejection to send to the quiz creator..."
                                rows={4}
                            />
                            </>
                        )}

                        <div className="modalActions">
                            <button onClick={() => setShowConfirmModal(false)}>Cancel</button>

                            <button onClick={async () => handleConfirmAction(isRejecting, rejectionReason, selectedQuiz._id, token, 
                               setShowConfirmModal,  setResponse, setLoading, setQuizzes)}>Confirm</button>
                        </div>
                        </div>
                    </div>
                    )}
            </main>
        </>
    );
}
export default PendingQuiz
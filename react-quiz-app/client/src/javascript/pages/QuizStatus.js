import { getQuizzes,deleteQuiz, handleApiCallWithFeedback } from "../UserServices";

export async function fetchQuizStatuses(token, setMessage, setLoading, setQuizzes) {
    await handleApiCallWithFeedback({
        asyncFunc: () => getQuizzes({sourcePage: 'quiz-status'}, token),
        setMessage,
        setLoading,
        onSuccess: (data) => {
            setQuizzes(data.quizzes);  // set the quizzes now.
          },
    });
}
export async function deleteSelectedQuiz(quizId, token, setShowConfirmModal, setSelectedQuiz, setMessage, setLoading, setQuizzes) {
    await handleApiCallWithFeedback({
        asyncFunc: () => deleteQuiz(quizId, token),
        setMessage,
        setLoading,
        onSuccess: () => {
            setQuizzes(prev => prev.filter(quiz => quiz._id !== quizId));
            setShowConfirmModal(false);// close the modal once quiz is deleted.
            setSelectedQuiz(null); // reset selected quiz to null.
          },// remove quiz from the list once deleted.
        onError: (status, data) => {// if quiz cannot be deleted, e.g. already deleted or not found.
            if (status === 404 || status === 409) {
                setQuizzes(prev => prev.filter(q => q._id !== quizId));
            }
            setShowConfirmModal(false); // close the modal if error occurs.
            setSelectedQuiz(null); // reset selected quiz to null.
        }
    });
}

// Tjhis function just shows a modal box as confirmation before deleting a quiz.
//
export function showConfirmationPopUp(quiz, setSelectedQuiz, setShowConfirmModal) {
    setSelectedQuiz(quiz);
    setShowConfirmModal(true);
}
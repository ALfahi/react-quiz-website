import { changeQuizStatus, getQuizzes, handleApiCallWithFeedback } from "../UserServices";

export async function fetchPendingQuizzes(token, setMessage, setLoading, setQuizzes) {
    await handleApiCallWithFeedback({
        asyncFunc: () => getQuizzes({sourcePage: 'pending-quiz', isPublic: false, status: 'pending'}, token),
        setMessage,
        setLoading,
        onSuccess: (data) => {
            setQuizzes(data.quizzes);  // set the quizzes now.
          },
    });
}

async function acceptQuiz(quizId, token, setMessage, setLoading, setQuizzes)
{

    await handleApiCallWithFeedback({
        // rejected response is just either null or an empty string when accepting quiz
        asyncFunc: () => changeQuizStatus(true,"", quizId, token),
        setMessage,
        setLoading,
        onSuccess: () => {
            setQuizzes(prev => prev.filter(quiz => quiz._id !== quizId));
          },// remove quiz from the list once  status is changed.
        // if the quiz cannot be accepted or rejected if e.g. already changed status by another admin, or quiz is deleted.
        onError: (status, data) => {
        if (status === 404 || status === 409) {
            setQuizzes(prev => prev.filter(q => q._id !== quizId));
        }
    }});
}

async function rejectQuiz(quizId, rejectedReason, token,setMessage, setLoading, setQuizzes)
{
    // pass in rejectedReason for email later.
    await handleApiCallWithFeedback({
        asyncFunc: () => changeQuizStatus(false, rejectedReason, quizId, token),
        setMessage,
        setLoading,
        onSuccess: () => {
            setQuizzes(prev => prev.filter(quiz => quiz._id !== quizId));
          },// remove quiz from the list once  status is changed.
        //
        onError: (status, data) => {
        if (status === 404 || status === 409) {
            setQuizzes(prev => prev.filter(q => q._id !== quizId));
        }

    }});
}

// This function just shows a modal box as confirmation before changing a quizzes status.
//
export function showConfirmationPopUp( quiz, isQuizAccepted, setSelectedQuiz, setIsRejecting, setShowConfirmModal)
{
    console.log(isQuizAccepted);
    setSelectedQuiz(quiz);
    setIsRejecting(!isQuizAccepted);
    setShowConfirmModal(true);
}

// This function handles if the quiz is accepted or rejected.
//
export async function handleConfirmAction(isQuizRejected, rejectedReason, quizId, token, setShowConfirmModal, setMessage, setLoading, setQuizzes)
{
    setShowConfirmModal(false);
    if (isQuizRejected)
    {
        await rejectQuiz(quizId, rejectedReason, token, setMessage, setLoading, setQuizzes)
    }
    else
    {
        await acceptQuiz(quizId, token, setMessage, setLoading, setQuizzes)
    }
}
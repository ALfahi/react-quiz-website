import { getQuizzes,handleApiCallWithFeedback } from "../UserServices";

// This function just fetches all approved quizzes created by the user.
//
export async function fetchApprovedQuizzes(token, setMessage, setLoading, setQuizzes) {
    await handleApiCallWithFeedback({
        asyncFunc: () => getQuizzes({status: 'approved'}, token),
        setMessage,
        setLoading,
        onSuccess: (data) => {
            setQuizzes(data.quizzes);  // set the quizzes now.
          },
    });
}
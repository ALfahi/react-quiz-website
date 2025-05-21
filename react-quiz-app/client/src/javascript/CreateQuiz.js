
// methods to store the values entered into the input fields for this page (and store them in a local storage for 
// later use)


export function updateQuizTitle(event, setQuizName)
{
    let title = event.target.value;
    setQuizName(title)

}

export function updateTotalQuestions(event, setQuestions)
{
    let totalQuestions = event.target.value;
    setQuestions(totalQuestions)

}

export function submit(e, quizTitle, newImage, totalQuestions, navigate)
{
    e.preventDefault();
    // Replace local storage by instead uploading to server.
    localStorage.setItem('quizTitle', quizTitle);
    localStorage.setItem('imageBanner', newImage);// later make sure to upload it to a srveer and generate a public url so everone can see it.
    localStorage.setItem('totalQuestions', totalQuestions);
    navigate('../BuildQuiz');// an instance of useNavigate();

}
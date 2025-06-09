
// methods to store the values entered into the input fields for this page (and store them in a local storage for 
// later use)


export function updateQuizTitle(event, setQuizName, setMessage)
{
    let title = event.target.value;
    let trimmedQuizTitle = title.trim();
    setQuizName(title)
    if (title.length > 30)
    {
        setMessage("Quiz title cannot be longer than 30 characters");
    }
    else if (title.trim() === "")
    {
        setMessage("Quiz title cannot be empty");
    }
    else if (title !== trimmedQuizTitle)
    {
        setMessage("Quiz title cannot have leading or trailing spaces");
    }
    else
    {
        setMessage("");
    }

}

export function updateTotalQuestions(event, setQuestions)
{
    let totalQuestions = event.target.value;
    setQuestions(totalQuestions)

}

export function submit(e, quizTitle, imageFile, totalQuestions, navigate,)
{
    e.preventDefault();
    trimmedQuizTitle = quizTitle.trim();

    // do some validation here.
    if (quizTitle.length > 30 || quizTitle.length.trim() === "" || (quizTitle !== trimmedQuizTitle))
    {
        return;
    }
    navigate('../build-quiz', {state:{
        quizTitle: quizTitle,
        imageBanner: imageFile,// if it's the default image, then null is passed hence imageBanner is null.
        totalQuestions: totalQuestions
    }});// an instance of useNavigate();

}
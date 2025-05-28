
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

export function submit(e, quizTitle, imageFile, totalQuestions, navigate)
{
    console.log("total questions is", totalQuestions)
    e.preventDefault();
    navigate('../build-quiz', {state:{
        quizTitle: quizTitle,
        imageBanner: imageFile,// if it's the default image, then null is passed hence imageBanner is null.
        totalQuestions: totalQuestions
    }});// an instance of useNavigate();

}
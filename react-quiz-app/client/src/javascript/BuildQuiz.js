
// creates a an array of questions with default values for every question. Structure of each questions:
// text: (what's the actual question)
//options: an array of 4 possible options (these are the answer's and only one of them is correct)
// answer: specifies which of the 4 possible options are correct.
//
export function initialiseQuestions(totalQuestions) 
{
    let questionList = [];
    for (let i = 0; i < totalQuestions; i++) 
    {
        let question = {
            questionText: "",
            options: ["option 1", "option 2", "option 3", "option 4"],
            answer: 0
        };
        questionList.push(question);
    }
    return questionList;
}

// Conditional rendering functions
//
export function onLastQuestion(currentIndex, totalIndex) 
{
    return (currentIndex >= totalIndex - 1);
}

export function onFirstQuestion(currentIndex) 
{
    return (currentIndex <= 0)
}

// we only make changes to the current question and then save those changes to the question array when we move
// onto a new question.


// a generic method used to update each field of the current question and return the current question with the change field.
// updating an option for a question is slightly more complex than updating the answer or description of a question, hence
// we used a seperate boolean flag.
//
export function updateCurrentQuestionData(currentQuestionData, field, value, isOptionUpdate = false, optionIndex = null) {
    if (isOptionUpdate) {
        // updatedOption is the array of options, we then need to pick the desired option e.g. option 1, option 2 etc and set
        // it's value to the value that was passed into the function.
        let updatedOptions = [...currentQuestionData.options];
        updatedOptions[optionIndex] = value;
        return { ...currentQuestionData, options: updatedOptions };
    }// updating either the question description or the answer
    return { ...currentQuestionData, [field]: value };
}

// this function saves the current question data into the array of questions and then moves onto the next question
//
export function saveQuestion(
    questions, currentIndex, currentQuestionData, 
    setQuestions, setCurrentQuestion, setCurrentQuestionData, nextIndex
) {
    let updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = currentQuestionData;

    setQuestions(updatedQuestions); 
    // moving onto the next question and updating it's data.
    setCurrentQuestion(nextIndex);
    setCurrentQuestionData(updatedQuestions[nextIndex]);

    return updatedQuestions; // Return the updated array
}

export function submit(questions)
{
    console.log(questions);
    //console.log(Object.keys(localStorage)); // Lists all keys in localStorage
    console.log(localStorage.getItem('imageBanner'));
    console.log(localStorage.getItem('quizTitle'));
    // also remeber to get the username

}
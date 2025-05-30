// creates a an array of questions with default values for every question. Structure of each questions:
// text: (what's the actual question)
//options: an array of 4 possible options (these are the answer's and only one of them is correct)
// answer: specifies which of the 4 possible options are correct.

import { createQuiz, handleApiCallWithFeedback } from "./UserServices";
import { isValidImageType } from "./Utils";

// This function just initialises a question set with default values, which are then to be edited by users.
//
export function initialiseQuestions(totalQuestions) 
{
    let questionList = [];
    for (let i = 0; i < totalQuestions; i++) 
    {
        let question = {
            questionText: "",
            options: ["option 1", "option 2", "option 3", "option 4"],
            correctAnswer: 0,// key name must be same as the one in the db to prevent any errors.
            // correctAnswer is also just the index of the options array, representing which one is correct.
            imageFile: null, // an optional image that users can upload that can can be in questions.
            imagePreview:null// used to show the image whilst user is still making the quiz.

        };
        questionList.push(question);
    }
    return questionList;
}

// Removes an option from a question.
// If the correct answer was removed, resets it to null so the user must choose again.
export function removeOption(currentQuestion, indexToRemove, setCurrentQuestionData, setMessage) {

    let options = currentQuestion.options;
    let correctAnswer = currentQuestion.correctAnswer
    console.log(currentQuestion);
    console.log(options);
    if (options.length > 2) {
        const newOptions = options.filter((_, i) => i !== indexToRemove);

        let newCorrectAnswer = correctAnswer;

        // If the removed option was the correct answer
        if (indexToRemove === correctAnswer) {
            newCorrectAnswer = null;
        }
        // If the removed option was before the current correct answer index, shift the index down
        else if (indexToRemove < correctAnswer) {
            newCorrectAnswer = correctAnswer - 1;
        }

        setCurrentQuestionData({
            ...currentQuestion,
            options: newOptions,
            correctAnswer: newCorrectAnswer
        });
    } else {
        setMessage("You need at least 2 answer options!");
        return;
    }
}

// This function adds in a new option for the current question if the current question has less than 4 total options.
//
export function addOption(currentQuestion, setCurrentQuestionData, setMessage) {
    const options = currentQuestion.options;

    if (options.length >= 4) {
        setMessage("You can only have up to 4 options.");
        return;
    }

    const newOptions = [...options, `option ${options.length + 1}`];

    setCurrentQuestionData({
        ...currentQuestion,
        options: newOptions,
    });
}

// This function is used to add an image to a question:
// 
export function handleImageChange(event, currentQuestionData, setCurrentQuestionData) {
    const file = event.target.files[0];
    // checks to see if the image is of the correct type (and also checks if an image has been uploaded in first place).
    if (!isValidImageType(file)) {
      return;
    }
    
    // remove the previous image if the question had an image before.
    if (currentQuestionData.imagePreview) {
      URL.revokeObjectURL(currentQuestionData.imagePreview);
    }
  
    const url = URL.createObjectURL(file);
  
    setCurrentQuestionData({ ...currentQuestionData, imagePreview: url, imageFile: file,});
  }
// This function is used to remove an image from the current question.
//
export function removeImageFromQuestion(currentQuestion, setCurrentQuestionData)
{
    if (currentQuestion.imagePreview) {
        URL.revokeObjectURL(currentQuestion.imagePreview);
      }
      setCurrentQuestionData((prev) => ({
        ...prev,
        imageFile: null,
        imagePreview: null,
      }));
}

// This function just keeps track if we are on the final question.
export function onLastQuestion(currentIndex, totalIndex) 
{
    return (currentIndex >= totalIndex - 1);
}

// This function keeps track if we are on the first question.
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

// This function is used to validate if the questions that the user typed in is valid (i.e. not empty) before they submit it
//
function areQuestionsEmpty(questions, setMessage) {
    for (const question of questions) {
      // Check question text
      if (!question.questionText || question.questionText.trim() === "") {
        setMessage("one or more of the question descriptions are empty.")
        return true;
      }
  
      // Check if options exist and not empty
      if (!Array.isArray(question.options) || question.options.length === 0) {
        setMessage("must have at least 2 options per question")
        return true;
      }
  
      // Check all options are filled
      for (const option of question.options) {
        if (!option || option.trim() === "") {
            setMessage("one or more of the texts on the options are empty")
            return true;
        }
      }
  
      // Check answer validity
      if (typeof question.correctAnswer !== "number" || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        setMessage("one or more of the questions has an empty answer field.")
        return true;
      }
    }
    setMessage("");
    return false; // no invalid data found
  }
  
  // This function checks if the current quiz data is different to whats saved (e.g. if any chages has been made after last
  // time that it was saved. returns a boolean)
  // This only checks between questions as quiz title and banner are determined before BuildQuiz.jsx page.
  //
  export function hasQuestionsSaved(prevQuestions)
  {

  }

export async function submit(title, imageBanner, questions, user, setMessage, setLoading, navigate)
{
    if (!user)
    {
        console.error("user does not exist as time of creating quiz");
        return;
    }
    if (areQuestionsEmpty(questions, setMessage))// some of the fields in questions are empty, can't submit.
    {
        return;
    }

    const formData = new FormData();
    console.log(questions);
    formData.append("username", user?.id);// just pass in the user's id instead of name to link the quiz to the user in db.
    formData.append("questions", JSON.stringify(questions));// convert the questions array into a string.
    formData.append("title", title);
    formData.append("banner", imageBanner);

    // also append any images that the some questions may have.
    questions.forEach((q, index) => {
        if (q.imageFile) {
            formData.append(`question_${index}`, q.imageFile);
        }
    });

    // now pass it into the back end for processing.
    await handleApiCallWithFeedback({
        asyncFunc: () => createQuiz(formData),
        setMessage,
        setLoading,
        successMessage: "quiz has been successfully created",
        navigateTo: "/quiz-menu",
        navigate: navigate,
    })

}
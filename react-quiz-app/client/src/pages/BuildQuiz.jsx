import { useState, useEffect, useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    initialiseQuestions, 
    updateCurrentQuestionData, 
    onLastQuestion, 
    onFirstQuestion, 
    submit,
    removeOption,
    addOption, handleImageChange, removeImageFromQuestion
} from "../javascript/BuildQuiz";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Spinner from "../components/Spinner"
import QuizOption from "../components/QuizOption";

import "../css/BuildQuiz.css";

function BuildQuiz() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();

    // Try to recover quiz state from session storage
    const savedState = sessionStorage.getItem("quizState");
    const parsedSavedState = savedState ? JSON.parse(savedState) : null;

    // Destructure state from either navigation or session storage
    const { quizTitle,imageBanner,totalQuestions} = location.state || parsedSavedState || {};


    // initialise questions from navigation state, sessionStorage, or default
    const [questions, setQuestions] = useState(
        parsedSavedState?.questions || initialiseQuestions(totalQuestions) || []
    );
    const [currentQuestion, setCurrentQuestion] = useState(parsedSavedState?.currentQuestion || 0);

    // only update the current question locally and save to the big questions array when we move onto a different question or finish
    // improves performance by a noticible margin, especially for large numbers of users.
    const [currentQuestionData, setCurrentQuestionData] = useState(questions[currentQuestion]);

     // creating a varibale to store the initial question state (used to keep track if the user has made any changes since last time of saving it.)
     const initialQuestions = useRef(
        parsedSavedState?.questions?.map(q => ({ ...q, imageFile: null, imagePreview: null })) 
        || initialiseQuestions(totalQuestions)
    );

    const hasUnsavedChanges = JSON.stringify(questions) !== JSON.stringify(initialQuestions.current);

    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);


        // Sync currentQuestionData to match selected index (loads new template question data when we go to a new question)
    useEffect(() => {
        setCurrentQuestionData(questions[currentQuestion]);
    }, [currentQuestion]);

    // Update questions only if question data changed, used to update the questions array with the current questions data array.
    useEffect(() => {
        setQuestions(prev => {
            if (JSON.stringify(prev[currentQuestion]) === JSON.stringify(currentQuestionData)) {// stops any unnecssary rerenders.
                return prev;
            }

            const updated = [...prev];
            updated[currentQuestion] = currentQuestionData;
            return updated;
        });
    }, [currentQuestionData, currentQuestion]);


    // we don't want to use local storage for storing quizzes as it's very finicky and a lot of extra code to manage properly
    // instead we use react's state management and sessionStorage to store the quiz state so that 
    // when we go to a separate page, the quiz is gone, but we also use session storage to save the quiz state so 
    // that if the user refreshes the page, they can recover their quiz state.
    useEffect(() => {
        if (quizTitle && totalQuestions) {
            const questionsToSave = questions.map(q => ({
                ...q,
                imagePreview: null,// since image files are not saved when refresh, we need to show it visually by resetting
                // all image previews.
                imageFile: null, // remove file object before saving, as we won't be able to save them in back end if they are in
                // local or session storage.
            }));
            sessionStorage.setItem(
                "quizState",
                JSON.stringify({ quizTitle, imageBanner, totalQuestions, questions: questionsToSave, currentQuestion })
            );
        } else {
            // If still nothing available, redirect to create quiz
            navigate("/create-quiz");
        }
    }, [quizTitle, imageBanner, totalQuestions, questions, currentQuestion, navigate]);

    // This use effect is used to warn the user that some data may be lost when they refresh the page:
    //
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (hasUnsavedChanges) { // Only warn if changes were made
                event.preventDefault();
                event.returnValue = "";
            }
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload); // Attach unload listener
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload); // Clean up on unmount
        };
    }, [hasUnsavedChanges]); // ⬅️ Re-run effect if unsaved changes state changes

    // This use effect will run when this component unmounts (i.e user goes to another page), it will clear the session storage.
    useEffect(() => {
        return () => {
            sessionStorage.removeItem("quizState");
        };
    }, []);

    return (
        <main>
            <form>
                <h2>Question {currentQuestion + 1} / {totalQuestions}</h2>

                {/* Textarea for question description */}
                <textarea
                    placeholder="Enter question here..."
                    value={currentQuestionData.questionText}
                    onChange={(e) =>
                        setCurrentQuestionData(
                            updateCurrentQuestionData(currentQuestionData, "questionText", e.target.value)
                        )
                    }
                />

                {/*optional image container goes here */}
                {/* toggling different classes for different syles depending if there is an image present or not */}
                <div className={`imageUploadContainer ${currentQuestionData.imagePreview ? "withImage" : "noImage"}`}>
                    <input
                        id="questionImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, currentQuestionData, setCurrentQuestionData)}
                    />

                    {currentQuestionData.imagePreview && (
                        <div className="imagePreview">
                            <img
                                src={currentQuestionData.imagePreview}
                                alt="Question"
                            />

                            {/* Buttons in a row */}
                            <div className="imageActions">
                                <label htmlFor="questionImage">Change Image</label>
                                <Button
                                text="Remove Image"
                                onClick={() => removeImageFromQuestion(currentQuestionData, setCurrentQuestionData)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Show Add Image only if no preview exists */}
                    {!currentQuestionData.imagePreview && (
                        <div className="imageActions">
                            <label htmlFor="questionImage">Add Image</label>
                        </div>
                    )}

                </div>

                
                {/* Options Section */}
                <div className = "optionsContainer">
                    <div className="options">
                        {currentQuestionData.options.map((option, index) => (
                            <div key={index}>
                                <QuizOption
                                    text={option}
                                    picked={currentQuestionData.correctAnswer === index}
                                    onTextChange={(newText) =>
                                        setCurrentQuestionData(
                                            updateCurrentQuestionData(currentQuestionData, "options", newText, true, index)
                                        )
                                    }
                                    onSelect={() =>
                                        setCurrentQuestionData(
                                            updateCurrentQuestionData(currentQuestionData, "correctAnswer", index)
                                        )
                                    }
                                    onRemove={() => 
                                        removeOption(currentQuestionData, 
                                        index, setCurrentQuestionData, setResponse)}
                                />
                            </div>
                        ))}

                    <button className = "addOptionButton" onClick = {() => addOption(currentQuestionData, setCurrentQuestionData, setResponse)}>
                        +</button>
                    </div>
                </div>

                <p>*please specify which of the options will be the correct answer by checking the correct answer*</p>
                <p className = "response">{response}</p>{/* response from back end */}

                {/* Navigation Buttons */}
                <div className="buttons">
                    {!onFirstQuestion(currentQuestion) && (
                        <Button
                            text="Prev"
                            onClick={() => setCurrentQuestion(prev => prev - 1)}
                        />
                    )}
                    {!onLastQuestion(currentQuestion, totalQuestions) && (
                        <Button
                            text="Next"
                            className="next"
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                        />
                    )}
                    {onLastQuestion(currentQuestion, totalQuestions) && (
                        <Button
                            text="Finish"
                            onClick={() => {
                                submit(quizTitle, imageBanner, questions, user, setResponse, setLoading, navigate);
                            }}
                        />
                    )}
                </div>
            </form>
            {loading && <Spinner message = "loading..."/>}
        </main>
    );
}

export default BuildQuiz;

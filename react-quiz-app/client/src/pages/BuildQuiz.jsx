import { useState } from "react";
import { 
    initialiseQuestions, 
    updateCurrentQuestionData, 
    onLastQuestion, 
    onFirstQuestion, 
    saveQuestion,
    submit
} from "../javascript/BuildQuiz";
import {getTotalQuestionsLocal} from "../javascript/Utils";
import Button from "../components/Button";
import QuizOption from "../components/QuizOption";

import "../css/BuildQuiz.css";

function BuildQuiz() {
    const totalQuestions = getTotalQuestionsLocal();
    const [questions, setQuestions] = useState(initialiseQuestions(totalQuestions)); // provides an array of a default blueprint for all questions
    const [currentQuestion, setCurrentQuestion] = useState(0); // index to keep track of what question we are on.

    // only update the current question locally and save to the big questions array when we move onto a different question or finish
    // improvs performance by a noticible margin, especially for large numbers of users.
    const [currentQuestionData, setCurrentQuestionData] = useState(questions[currentQuestion]); 

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

                {/* Options Section */}
                <div className="options">
                    {currentQuestionData.options.map((option, index) => (
                        <div key={index}>

                            <QuizOption 
                                text={option}
                                picked={currentQuestionData.answer === index} 
                                onTextChange={(newText) => 
                                    setCurrentQuestionData(
                                        updateCurrentQuestionData(currentQuestionData, "options", newText, true, index)
                                    )
                                }
                                onSelect={() => 
                                    setCurrentQuestionData(
                                        updateCurrentQuestionData(currentQuestionData, "answer", index)// 'index' here is just the value
                                    )
                                }
                             />

                        </div>
                    ))}
                </div>

                <p>*please specify which of the options will be the correct answer by checking the correct answer*</p>

                {/* Navigation Buttons */}
                <div className="buttons">
                    {!onFirstQuestion(currentQuestion) && (
                        <Button 
                            text="Prev" 
                            onClick={() => saveQuestion(
                                questions, currentQuestion, currentQuestionData, 
                                setQuestions, setCurrentQuestion, setCurrentQuestionData, 
                                currentQuestion - 1)
                            }
                        />
                    )}
                    {!onLastQuestion(currentQuestion, totalQuestions) && (
                        <Button 
                            text="Next" className = "next"
                            onClick={() => saveQuestion(
                                questions, currentQuestion, currentQuestionData, 
                                setQuestions, setCurrentQuestion, setCurrentQuestionData, 
                                currentQuestion + 1)
                            }
                        />
                    )}
                    {/* if we are on the last question, replace next button with a finish button */}

                    {onLastQuestion(currentQuestion, totalQuestions) && (
                        <Button 
                            text="Finish" 
                            onClick={() => {
                                let updatedQuestions =saveQuestion(
                                    questions, currentQuestion, currentQuestionData, 
                                    setQuestions, setCurrentQuestion, setCurrentQuestionData, 
                                    currentQuestion);
                                submit(updatedQuestions);{/*make sure that we submit the most updated questions array*/}
                            }}
                        />
                    )}

                  
                </div>
            </form>
        </main>
    );
}

export default BuildQuiz;

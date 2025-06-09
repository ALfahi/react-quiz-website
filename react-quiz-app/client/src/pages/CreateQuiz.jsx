import "../css/CreateQuiz.css"
import {useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import Textbox from "../components/Textbox"
import Card from "../components/Card"
import defaultImage from "../assets/quizDefault.png";
import {editImage,changeFileImage } from "../javascript/Utils";
import {updateQuizTitle, updateTotalQuestions, submit} from "../javascript/pages/CreateQuiz";

function CreateQuiz(){

    // logic to change image
    const [imageURL, setImageURL] = useState(defaultImage);
    const [imageFile, setImageFile] = useState(null); // This is what we'll send to the backend if changed
    const [title, setQuizTitle] = useState("");
    const [score, setTotalScore] = useState(0);// keeps track total number of questions.
    // logic to display a preview of the quiz banner
    const [display, showCard] = useState(false);
    const [response, setResponse] = useState(""); // response from backend
    const navigate = useNavigate();

    // we also need to clean up the image URL when the component unmounts or when the imageFile changes.
    useEffect(() => {
        return () => {
            if (imageFile) URL.revokeObjectURL(imageURL);
        };
    }, [imageFile, imageURL]);

    return(
        <>
            <main>
                <form onSubmit = {(e) => submit(e, title, imageFile, score, navigate )}>
                    <Textbox defaultText = "Enter quiz name"  
                         onChange= {(e) => updateQuizTitle(e, setQuizTitle, setResponse)} required = {true}></Textbox>

                    <div className = "sameLine">
                        <label htmlFor = "numberOfQuestion">numberOfQuestions (max 20): </label>
                        <input name = "numberOfQuestions" type = "number" min = "1" max = "20"  onChange 
                         = {(e) => updateTotalQuestions(e, setTotalScore)} required/>
                    </div>  

                    <figure>
                        <div className = "imageContainer">
                            <img src = {imageURL} alt = "default quiz banner image"></img>
                        </div>  

                        <div className = "imageButtons">
                            <button type = "button" id = "reset" onClick = {
                                () => editImage(setImageURL, setImageFile, defaultImage, null)}>reset</button>
                            <button  type = "button" id  = "preview" onClick = {() => showCard(true)}>preview</button>
                        </div>
                    </figure>

                    <div className = "sameLine">
                        <label htmlFor = "file">upload image file:</label>
                        <input type = "file" id = "file" accept=".png,.jpeg,.jpg,.bmp,.webp,.ico,.tiff"
                      onChange={(e) =>changeFileImage(e, setImageURL, setImageFile)}></input>{/* will automatically change the image */}
                    </div>

                    <input type = "submit" id = "submit"></input>
                    <p className = "response">{response}</p>{/* response from back end */}
                </form>
                {/* render the card if the display property is true */}
                {display &&(
                      <section className = "previewCard">
                        <button type = "button" id = "crossButton" onClick = {() => showCard(false)}>X</button>{/* close the preview 
                        pop up */}
                      <Card imageLink = {imageURL} username = "testing" quizName = {title} totalScore = {score}></Card>
                  </section>

                )}
            
            </main>
        </>
    )
}

export default CreateQuiz
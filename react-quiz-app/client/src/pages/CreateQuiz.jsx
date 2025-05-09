import "../css/CreateQuiz.css"
import {useState} from "react"
import {useNavigate} from 'react-router-dom'
import Textbox from "../components/Textbox"
import Card from "../components/Card"
import defaultImage from "../assets/quizDefault.png";
import {editImage,changeFileImage } from "../javascript/Utils";
import {updateQuizTitle, updateTotalQuestions, submit} from "../javascript/CreateQuiz";

function CreateQuiz(){

    // logic to change image
    let [image, setImage] = useState(defaultImage);

    let [title, setQuizTitle] = useState("");
    let [score, setTotalScore] = useState("");
    // logic to display a preview of the quiz banner
    let [display, showCard] = useState(false);
    const navigate = useNavigate();

    return(
        <>
            <main>
                <form onSubmit = {(e) => submit(e, title, image, score, navigate )}>
                    <Textbox defaultText = "Enter quiz name"  
                         onChange= {(e) => updateQuizTitle(e, setQuizTitle)} required = {true}></Textbox>

                    <div className = "sameLine">
                        <label htmlFor = "numberOfQuestion">numberOfQuestions (max 20): </label>
                        <input name = "numberOfQuestions" type = "number" min = "1" max = "20"  onChange 
                         = {(e) => updateTotalQuestions(e, setTotalScore)} required/>
                    </div>  

                    <figure>
                        <div className = "imageContainer">
                            <img src = {image} alt = "default quiz banner image"></img>
                        </div>  

                        <div className = "imageButtons">
                            <button type = "button" id = "reset" onClick = {() => editImage(setImage, defaultImage)}>reset</button>
                            <button  type = "button" id  = "preview" onClick = {() => showCard(true)}>preview</button>
                        </div>
                    </figure>

                    <div className = "sameLine">
                        <label htmlFor = "file">upload image file:</label>
                        <input type = "file" id = "file" accept=".png,.jpeg,.jpg,.bmp,.webp,.ico,.tiff"
                        onChange={(e) => changeFileImage(e, setImage)}></input>{/* will automatically change the image */}
                    </div>

                    <input type = "submit" id = "submit"></input>
                </form>
                {/* render the card if the display property is true */}
                {display &&(
                      <section className = "previewCard">
                        <button type = "button" id = "crossButton" onClick = {() => showCard(false)}>X</button>{/* close the preview 
                        pop up */}
                      <Card imageLink = {image} username = "testing" quizName = {title} totalScore = {score}></Card>
                  </section>

                )}
            
            </main>
        </>
    )
}

export default CreateQuiz
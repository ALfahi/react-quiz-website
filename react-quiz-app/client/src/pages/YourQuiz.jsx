import {Link} from "react-router-dom";
import "../css/YourQuiz.css"
import Button from "../components/Button";
function YourQuiz(){
    return(
        <>
            <main>
                <div className = "pageContainer">
                <section className = "quizzContainer">
                    {/*to do */}
                    <table>
                        <thead>
                            <tr>
                                <td>Quiz Title:</td>
                                <td>Total Players:</td>
                                <td>Average Score:</td>
                            </tr>
                        </thead>

                        <tbody>
                            {/*data goes in here*/}
                        </tbody>
                    </table>
                </section>

                <aside>
                    <Link to = "../CreateQuiz">
                        <Button text = "create quiz"></Button>
                    </Link>
                </aside>
                </div>  
            </main>
        </>
    )
}

export default YourQuiz
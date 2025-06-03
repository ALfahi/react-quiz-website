import Card from "../components/Card";
import "../css/QuizMenu.css";
import Textbox from "../components/Textbox";  

/* to DO: make sure to add in that polling and refresh logic to always show up to date quizzes */
function QuizMenu(){
    return(
        <>
        <main>
            <div className = "searchBar">
                <Textbox defaultText= "Search quiz..."></Textbox>
            </div>

            <section className = "containerScroll">
                <Card  username = "Fahi Sabab" 
                quizName = "Quiz iqwdjiedqdhuruih4urhu4jrio9jrijr"></Card>
                {/*max char is 29 */}

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>
                {/*max char is 29 */}

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>
                {/*max char is 29 */}

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>
                {/*max char is 29 */}

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>
                {/*max char is 29 */}

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

                <Card  username = "Fahi Sabab" 
                quizName = "Quiz"></Card>

               
                
           
                
            </section>
        </main>
        </>
    )
}

export default QuizMenu
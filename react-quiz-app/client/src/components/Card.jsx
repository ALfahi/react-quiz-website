import "../css/Card.css";
import Score from "../components/CircleScore.jsx";
import defaultImage from "../assets/quizDefault.png";

function Card({ imageLink = defaultImage, username, quizName, totalScore = 20 }) {
  

    return (
        <div className="card">
            <div className="banner">
                <img src = {imageLink}></img>
            </div>
            
            <div className="content">
                <div className="text">
                    <h2>{quizName}</h2>
                    <h3>made by {username}</h3>
                </div>
                <Score totalScore={totalScore} />
            </div>
        </div>
    );
}

export default Card;

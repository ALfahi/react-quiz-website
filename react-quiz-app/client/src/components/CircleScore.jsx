import "../css/CircleScore.css"

function circleScore({userScore = 0, totalScore})
{
    return(
        <>
        <div className = "circle">
            <p>{userScore}</p>
            <hr></hr>
            <p>{totalScore}</p>
        </div>
        </>
    )
}

export default circleScore
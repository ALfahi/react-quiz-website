// this component is used for in the actual quizzes themselves, user's will click these options to choose the correct answer
// text: the text displayed on this component
// picked: used by quiz makers to mark if this partuclar option is the correct answer
// onTextChange: a handler used to edit the text on this component by the quiz makers.
//

import "../css/QuizOption.css"
function QuizOption({ text, picked, onTextChange, onSelect, onRemove, readOnly = false})
{
    return (
        <>
            <div className="quizOption">

            {!readOnly && (/* a button to be used by quiz builders to remeove this option if necessary */
                    <button type = "button" className = "removeButton" onClick = {onRemove}>X</button>
                    )}
                {/* Input field for option text */}
                <textarea
                    
                    value={text} 
                    readOnly={readOnly} 
                    onChange={(e) => onTextChange && onTextChange(e.target.value)}
                    className = "ellipse"
                />

                {/* Radio button for selecting the correct answer */}
                <input 
                    type="radio" 
                    checked={picked} 
                    onChange={onSelect}
                />
            </div>

        </>
    );
}

export default QuizOption;

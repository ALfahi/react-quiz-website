import '../css/ErrorList.css';

function ErrorList({ errors, className}) 
{
    if (!errors || errors.length === 0) 
    {
        return null;
    }
    return (
        <ul>
            {errors.map((err, index) => (
                <li className = {className} key={index}>{err}</li>
            ))}
        </ul>
    );
}

export default ErrorList;
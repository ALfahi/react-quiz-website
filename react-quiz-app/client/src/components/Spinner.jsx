import { ClipLoader } from "react-spinners"
import  "../css/Spinner.css"
function Spinner({message})
{
    return(<>
    <div className = "loadingBar">
        <p className = "loadingMessage">{message}</p>
        <ClipLoader
        color='#999'
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
    </>)
}
export default Spinner;
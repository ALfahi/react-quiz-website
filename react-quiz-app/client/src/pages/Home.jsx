import {Link} from "react-router-dom";
import "../css/Home.css"
import Button from "../components/Button";// adding extra dot to go up one level back into
// /src/ so that we can go into components.    

function Home(){
    return(
        <>
        <main>
            <div className = "homeContainer">
                <Link to = "/Login">
                    <Button text = "Login" className = "homeButton"></Button>
                </Link>

                <Link to = "/Register">
                    <Button text = "Register" className = "homeButton"></Button>
                </Link>
            </div>
        </main>
        </>
        
    )

    
}

export default Home
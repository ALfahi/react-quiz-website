import { HashRouter as Router, Routes, Route} from 'react-router-dom';

//importing components
import Header from "./components/Header";
import LoginWarning from './components/LoginWarning';

// importing pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgottenPassword from './pages/ForgottenPassword';
import ChangeEmail from './pages/ChangeEmail';
import QuizMenu from './pages/QuizMenu';
import YourQuiz from './pages/YourQuiz';
import QuizStatus from './pages/QuizStatus';
import CreateQuiz from './pages/CreateQuiz';
import PendingQuiz from './pages/PendingQuiz';
import BuildQuiz from './pages/BuildQuiz';
import VerifyEmailPage from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';


function App() 
{
  return(
    <>
      {/*Rendering in the pages*/}

      <Router>
        <Header className = "Header">
        </Header>
          <div className = "Content">
            <Routes>
              <Route path = "/" element = {<Home/>}/>
              <Route path = "/Login" element = {<Login/>}/>
              <Route path = "/Register" element = {<Register/>}/>
              <Route path = "/ForgottenPassword" element = {<ForgottenPassword/>}/>
              <Route path = "/ChangeEmail" element = {<ChangeEmail/>}/>
              <Route path = "/QuizMenu" element = {<QuizMenu/>}/>
              <Route path = "/YourQuiz" element = {<YourQuiz/>}/>
              <Route path = "/QuizStatus" element = {<QuizStatus/>}/>
              <Route path = "/CreateQuiz" element = {<CreateQuiz/>}/>
              <Route path = "/PendingQuiz" element = {<PendingQuiz/>}/>
              <Route path = "/BuildQuiz" element = {<BuildQuiz/>}/>
              <Route path = "/VerifyEmail" element = {<VerifyEmailPage/>}/>
              <Route path = "/ResetPassword" element = {<ResetPassword/>}/>
            </Routes>
          </div>
    </Router>
    <LoginWarning/>
  </>
  )
}

export default App

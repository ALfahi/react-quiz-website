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

// importing the protectedPage wrapper class.
import ProtectedPage from './components/ProtectedPage';

// importing the NotFoundPage to act as an else cause if there is an invalid url.
import NotFound from './pages/NotFound';


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
              <Route path = "/login" element = {<Login/>}/>
              <Route path = "/register" element = {<Register/>}/>
              <Route path = "/forgotten-password" element = {<ForgottenPassword/>}/>
              <Route path = "/change-email" element = {<ProtectedPage page = {<ChangeEmail/>}/>}/>
              <Route path = "/quiz-menu" element = {<QuizMenu/>}/>
              <Route path = "/your-quiz" element = {<ProtectedPage page = {<YourQuiz/>}/>}/>
              <Route path = "/quiz-status" element ={<ProtectedPage page = {<QuizStatus/>}/>}/>
              <Route path = "/create-quiz" element = {<ProtectedPage page = {<CreateQuiz/>}/>}/>
              <Route path = "/pending-quiz" element = {<ProtectedPage page = {<PendingQuiz/>} admin = {true}/>}/>
              <Route path = "/build-quiz" element = {<ProtectedPage page = {<BuildQuiz/>}/>}/>
              <Route path = "/verify-email" element = {<VerifyEmailPage/>}/>
              <Route path = "/reset-password" element = {<ResetPassword/>}/>
               {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
    </Router>
    <LoginWarning/>
  </>
  )
}

export default App

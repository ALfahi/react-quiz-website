import express from 'express';
import{upload} from '../multerConfig.js';
import { changeQuizStatus, createQuiz, getQuizzes, deleteQuiz} from '../controllers/quizController.js';


const router = express.Router();
router.post('/createQuiz',  upload.any(), createQuiz);// we use upload.any since quizzes can have varying questions.
router.get('/getQuizzes', getQuizzes);
router.post('/updateQuizStatus', changeQuizStatus)
router.post('/deleteQuiz', deleteQuiz);
  

export default router;
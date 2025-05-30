import express from 'express';
import{upload} from '../multerConfig.js';
import { createQuiz } from '../controllers/quizController.js';


const router = express.Router();
router.post('/createQuiz',  upload.any(), createQuiz)// we use upload.any since quizzes can have varying questions.
  

export default router;
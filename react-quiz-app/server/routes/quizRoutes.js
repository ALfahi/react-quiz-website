import express from 'express';
import{upload} from '../multerConfig.js';
import { createQuiz } from '../controllers/quizController.js';


const router = express.Router();
router.post('/createQuiz', upload.single('banner'),createQuiz);

export default router;
import fs from 'fs/promises';
import path from 'path';
import Quiz from '../models/quizModel.js';
import { getUniqueIdentifier } from '../utils/general.js';

// creates a new quiz in database and also moves all associated assets to a newly created folder.
//
export async function createQuiz(req, res) {
    try {
        console.log("Files received:", req.files);
      const { username, questions, title } = req.body;
      const parsedQuestions = JSON.parse(questions);
      const files = req.files || [];
  
      // Generate unique quiz id
      const quizId = await getUniqueIdentifier(Quiz);
  
      // Create folder name from safe title + id
      const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
      const folderName = `${safeTitle}-${quizId}`;
      const uploadPath = path.join('uploads', folderName);
  
      // Create upload folder
      await fs.mkdir(uploadPath, { recursive: true });
  
      // Separate banner file and question files from req.files
      let bannerFile = null;
      const questionFilesMap = new Map(); // key: question index, value: file
  
      for (const file of files) {
        if (file.fieldname === 'banner') {
          bannerFile = file;
        } else if (file.fieldname.startsWith('question_')) {
          // get question index from fieldname 'question_0', 'question_1', etc.
          const indexStr = file.fieldname.split('_')[1];
          if (!isNaN(indexStr)) {
            questionFilesMap.set(Number(indexStr), file);
          }
        }
      }
  
      // Handle banner upload
      let bannerPath = 'quizDefault.png'; // fallback
      if (bannerFile) {
        const bannerDest = path.join(uploadPath, 'banner' + path.extname(bannerFile.originalname));
        await fs.rename(bannerFile.path, bannerDest);
        bannerPath = path.join(folderName, path.basename(bannerDest));
      }
  
      // Handle question images upload
      for (let i = 0; i < parsedQuestions.length; i++) {
        if (questionFilesMap.has(i)) {
          const qFile = questionFilesMap.get(i);
          const questionDest = path.join(uploadPath, `question_${i}${path.extname(qFile.originalname)}`);
          await fs.rename(qFile.path, questionDest);
          parsedQuestions[i].imageFile = path.join(folderName, path.basename(questionDest));
        } else {
          parsedQuestions[i].imageFile = null;
        }
      }
  
      // Save quiz
      const newQuiz = new Quiz({
        _id: quizId,
        title,
        imageUrl: bannerPath,
        questions: parsedQuestions,
        createdBy: username,
        isPublic: false,
        status: 'pending',
      });
  
      await newQuiz.save();
  
      res.status(201).json({ message: 'Quiz created successfully' });
    } catch (err) {
      console.error(err);
      if (req.body?.folderName) {
        try {
          await fs.rm(path.join('uploads', req.body.folderName), { recursive: true, force: true });
        } catch (cleanupErr) {
          console.error('Error cleaning up folder:', cleanupErr);
        }
      }
      res.status(500).json({ message: 'Error creating quiz' });
    }
  }


export async function getQuizzes(req, res) {
    // to do.
}
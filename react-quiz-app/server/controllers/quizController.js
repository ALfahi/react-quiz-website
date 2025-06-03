import fs from 'fs/promises';
import path from 'path';
import Quiz from '../models/quizModel.js';
import { getUniqueIdentifier } from '../utils/general.js';
import { verifyToken } from '../utils/useAuth.js';
import { buildQuizFilter } from '../utils/userServices.js';
import { sendQuizStatusEmail } from '../utils/emailHelpers.js';

// creates a new quiz in database and also moves all associated assets to a newly created folder.
//
export async function createQuiz(req, res) {
    try {
      const decoded = verifyToken(req)
      const userId = decoded.id;
      const {questions, title } = req.body;
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
        if (questionFilesMap.has(i)) {// if the specific question has an image attatched to it:
          const qFile = questionFilesMap.get(i);
          const questionDest = path.join(uploadPath, `question_${i}${path.extname(qFile.originalname)}`);
          await fs.rename(qFile.path, questionDest);
          parsedQuestions[i].imageFile = path.join(folderName, path.basename(questionDest));
        } 
        else {
          parsedQuestions[i].imageFile = null;
        }
      }
  
      // Save quiz
      const newQuiz = new Quiz({
        _id: quizId,
        title,
        imageUrl: bannerPath,
        questions: parsedQuestions,
        createdBy: userId,
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
      res.status(err.status || 500).json({ message: err.message || 'Error creating quiz' });
    }
  }


export async function getQuizzes(req, res) {
    try{
      const decoded = verifyToken(req);
      // build a filter so that we can return the thing.
      const filter = await buildQuizFilter(req, decoded);
      //TO DO: make the sorting more general e.g. get it from req.
      // if the filter has a createdBy search, then it's trying to act a User username, so we must populate it beforehand.
      const quizzes = await Quiz.find(filter).sort({createdAt: -1}).populate('createdBy', 'username');
      let successMessage = quizzes.length === 0 ? "There are no quizzes at this moment in time." : "";
      res.status(200).json({quizzes: quizzes, message: successMessage})
    }
    catch(err){
      console.log(err);
      res.status(err.status || 500).json({ message: err.message || 'Error getting quizzes' });
    }
}

// This function will change the status of a quiz.
//
export async function changeQuizStatus(req, res) {
  try {
    const decoded = verifyToken(req);// this also verifies the token and will return an error if token is altered or doesn't exist etc.
    const { isQuizAccepted, rejectedReason, quizId } = req.body;

    if (decoded?.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can perform this action." });
    }

    // find the respective quiz so we can change it's status.
    const quiz = await Quiz.findById(quizId).populate('createdBy', 'email username');;
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // gracefully handle some race conditions.
    if (quiz.status !== 'pending') {
      return res.status(409).json({ message: "Quiz has already been accepted or rejected." });
    }

    if (isQuizAccepted)
    {
      console.log("hello");
      quiz.status = 'approved';
      quiz.isPublic = true;
    }
    else
    {
      quiz.status = 'rejected';
      // if quiz was rejected, auto delete from db in 5 days.
      quiz.rejectedExpiresAt = Date.now() + 5 * 60 * 1000;// 5 minutes.
    }
    
    await quiz.save(); // save quiz to db first and show a response, then in background send the email.
    res.status(200).json({ message: "Quiz status has been successfully changed." }); // respond quickly

    // trigger email in background to not slow down the UI in front end; to make it even better add job queues with mongo db to
    // retry sending emails if it fails.
    //
    setImmediate(() => {
      sendQuizStatusEmail(quiz.createdBy.email, quiz.createdBy.username, quiz.title, isQuizAccepted, rejectedReason)
        .catch((emailErr) => console.error("Failed to send quiz status email:", emailErr));
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while updating the quiz status." });
  }
}

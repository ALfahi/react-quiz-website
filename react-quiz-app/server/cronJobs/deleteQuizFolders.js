import cron from 'node-cron';
import { deleteQuizFolder } from '../utils/userServices.js';
import Quiz from '../models/quizModel.js';

export default function deleteExpiredQuizzes() {
  cron.schedule('0 */3 * * *', async () => {  // Runs every 3 hours
    console.log('Running TTL cleanup job...');

    const now = new Date();

    // Find quizzes where rejectedExpiresAt expired and delete their folders and quiz docs
    const expiredQuizzes = await Quiz.find({ rejectedExpiresAt: { $lte: now } });

    for (const quiz of expiredQuizzes) {
      try {
        await deleteQuizFolder(quiz); // Delete folder + files
        await Quiz.deleteOne({ _id: quiz._id }); // Delete quiz document
        console.log(`Deleted expired quiz ${quiz._id}`);
      } catch (err) {
        console.error(`Failed to delete quiz ${quiz._id}`, err);
      }
    }
  });
}

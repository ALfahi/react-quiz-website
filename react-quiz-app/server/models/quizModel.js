import mongoose from "mongoose";

// quizzes are created by users, but it isn't public yet and needs to be reviewed by admins first.
const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true }// index of options array, specifying which option is correct.
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Reference to users collection
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Status can be 'pending',
    //  'approved', or 'rejected', default is 'pending' whenever a quiz is first created, status will be changed by admins.
    isPublic: { type: Boolean, default: false },
    stats:
        {
            playCount: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 },
        },

});

const Quiz = mongoose.model('quizzes', quizSchema);

export default Quiz;
import mongoose from "mongoose";

// quizzes are created by users, but it isn't public yet and needs to be reviewed by admins first.
const quizSchema = new mongoose.Schema({
    _id: { type: String },
    title: { type: String, required: true },
    imageUrl:{type: String, default: 'quiz-default-image.png'}, // default image for the quiz, can be changed later.
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true },// index of options array, specifying which option is correct.
            imageFile: {type: String, default: null},// some questions may have images linked with them.
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
    rejectedExpiresAt: { type: Date, default: null }, // If a quiz is rejected, this field will be set to the date when the quiz will automatically
    // be deleted, default is null meaning it won't be deleted.

}, { _id: false }); // Allows us to set the  _id manually

// Automatically delete rejected quizzes when the rejectedExpiresAt date is reached
quizSchema.index({ rejectedExpiresAt: 1 }, { expireAfterSeconds: 0 }); 

const Quiz = mongoose.model('quizzes', quizSchema);

export default Quiz;
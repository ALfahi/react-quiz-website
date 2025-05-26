import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role:{type: String, enum: ['admin', 'user'], default: 'user'}, // Role can be 'admin' or 'user', default is 'user'
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],  // Reference to quizzes collection
    // some fields needed to safely send emails to the user.
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
});

const User = mongoose.model('users', userSchema);

export default User;
import mongoose from "mongoose";

// This is a schema which will temporarily store pending users (i.e. users who didn't fully complete the registration),
// once they are fully registered or after the time to live expires, the entry will be deleted.
const pendingUserSchema = new mongoose.Schema({
    pendingUsername: { type: String, required: true },
    pendingPassword: { type: String, required: true },
    pendingEmail: { type: String, required: true },
    verificationToken: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },// we need this to auto delete an entry after a set period of time.
    updatedAt: { type: Date, default: Date.now } // Track last update time for token invalidation
});

// making the entries expire after 1 hour
const TTL = 3600;
pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: TTL})

const PendingUsers = mongoose.model('pendingUsers', pendingUserSchema);

export default PendingUsers;
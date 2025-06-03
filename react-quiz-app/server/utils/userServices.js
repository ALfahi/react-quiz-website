// This script contains some useful helper functions which is needed for the user controller logic.
import Users from '../models/userModel.js';
import PendingUsers from '../models/pendingUserModel.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';// use crpyto to hash tokens.
import { sendVerificationEmail } from '../utils/emailHelpers.js';
import { createJwtToken } from './general.js';

// This function is used to actually create a new user inside the database. If a duplicate username exists, then it will
// simply just not create the user.
//
export async function createUser(username,email, password) // TO DO: add in a duplicate email check as well later.
{
    try {
        const duplicateUser = await isExistingUser(username);
        // adding in a backend fallback to check if a user exists or not before creating a user.
        if (!duplicateUser)
        {
            const newUser = new Users({ username: username, email: email, password: password});
            await newUser.save();
            await PendingUsers.deleteOne({pendingEmail: email}); // delete the pendingUser entry after user is successfully made.
            return { success: true, user: newUser };
        }
        else
        {
            return  { success: false, message: "sorry but username already exists." };
        }
    } 
    catch (err) 
    {
        console.log(err);
        return  { success: false, message: "error creating user" };
    }
}

// This function just checks if passed in username already exists or not.
//
export async function isExistingUser(username)
{
    try{
        const duplicateUsername = await Users.findOne({username})// boolean value, checking if a duplicate username exists.
        return duplicateUsername !== null;
    }
    catch (err)
    {
        console.log(err);
    }
}

// This function is used to send a verification email to the clients email so they can 'activate' their account and save their 
// account to the database, it handles the initial email send request as it needs to create a token, and create a new entry into
// the pending users.
//
export async function handleRequestVerification({ username, email, password }) {
    try {
        // creating the token that we need
        const token = createJwtToken({ username, email, password }, '5m');
        // create the pending users entry
        await createPendingUser(username, email, password, token);

        await sendVerificationEmail(token, username, email);
        return { success: true };
    } catch (error) {
        console.error('Failed to send verification email:', error);
        return { success: false, error };
    }
}

// This function just creates a new pendingUser entry for when the user is in the middle of registering and actually
// activating their account.
//
async function createPendingUser(username, email, password, verificationToken)
{
    await invalidatePendingUserToken(email, verificationToken);// invalidate previous tokens if their exists any.

    // hash the password before saving it to the database.
    const hashedPassword = await bcrypt.hash(password, 12)
    // create a new entry
    const pendingUser = new PendingUsers({
        pendingUsername: username,
        pendingEmail: email,
        pendingPassword: hashedPassword,
        verificationToken
    })

    await pendingUser.save();// saving to database
}

//This function just invalidates any previous tokens when user wants to activate their account (so user most use most recent token)
//
export async function invalidatePendingUserToken(email, token)
{
    // First, invalidate any previous tokens.
    await PendingUsers.updateOne(
        { pendingEmail: email }, // email will be unique so we can just identify them by email.
        { $set: 
        { 
            updatedAt: new Date() ,// Update the timestamp to invalidate old expired tokens
            verificationToken: token, // replace the token with the new one to invalidate previous, non expired tokens.
        }, 
        },
    );
}

// This function creates a new UserReset token (returns plain text token), but hashes the token and stores that in db.
//
export async function createPasswordResetToken(email)
{
    const user = await Users.findOne({email});
    if (!user)
    {
        return;
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + (15 * 60 * 1000); // 15 mins

    await user.save();

    return resetToken; // Sending plaintext token into email.
}

//This function is used to validate any resetTokens before allowing user to save thier updated password or access the reset password page.
//
export async function validatePasswordResetToken(token) 
{
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await Users.findOne({ 
      passwordResetToken: hashedToken, 
      passwordResetExpires: { $gt: Date.now() }// token is not expired yet
    });
    return user;// will return null if the token is expired or invalid.
}
  
 
// Checks if the password and username/ email matches the one in the database (returns boolean)
//
export async function isValidUser(usernameOrEmail, password) {
    try {
        const user = await Users.findOne( {$or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]});
        if (!user) 
        {
            return false;
        }

        const match = await bcrypt.compare(password, user.password);
        return match;
    } catch (error) {
        console.error('Error checking password:', error);
        return false;
    }
}

// This function just updates the password of an existing user.
//
export async function updateUserPassword(token, newPassword) 
{
    const user = await validatePasswordResetToken(token);
    if (!user){
        return { success: false, message: 'Invalid or expired token' };
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
  
    await user.save();
    return { success: true, user };
  }

  // This fuction is used to build and return a filter to efficiently query quizzes.
  // This function also handles any back end checks to stop people from seeing quizzes that they are not supposed to
  // e.g. non admin people seeing 'pending' or private quizzes.
  //
  export async function buildQuizFilter(req, user) {
    const source = req.body || req.query;
    const { sourcePage, status, isPublic, id, search } = source;
  
    // search is what is typed by in the search bar, either a quiz title or a username.
    // id is the quiz's own id.
  
    const isAdmin = user?.role === 'admin';
    const currentUserId = user?.id?.toString(); // we need this variable to keep track if a user can see any quizzes made by a specific user
                                                // (e.g. a user checking their own quizzes can see all the quizzes regardless of status)
                                                // but a normal user/ guest can only see public quizzes.
  
    const filter = {};
    if (id) filter._id = id;
    if (status) filter.status = status;
  
    let orConditions = [];
    let matchedUserId = null;
  
    if (search) {
      // Check if search string matches a username, return any quizzes with that username
      const foundUser = await Users.findOne({ username: search }).select('_id');
      if (foundUser) {
        matchedUserId = foundUser._id.toString();
        orConditions.push({ createdBy: matchedUserId });
      }
  
      // Add title fuzzy match (always)
      orConditions.push({ title: new RegExp(search, 'i') });
    }
    /******** doing some page specific valiations */
  
    // User viewing own quizzes, even admins can't look at other user's quizzes within these pages.
    if (sourcePage === 'your-quizzes' || sourcePage === 'quiz-status') {
        filter.createdBy = currentUserId;
        if (orConditions.length > 0) filter.$or = orConditions;
        return filter;
    }
  
    // Admins can query anything (used in e.g. pending-quizzes page)
    if (sourcePage === 'pending-quiz') {
        if (!isAdmin) {
            throw { status: 403, message: "Only admins can view pending quizzes." };
        }
        if (typeof isPublic === 'boolean'){
                filter.isPublic = isPublic;
        }
        if (orConditions.length > 0) filter.$or = orConditions;
        return filter;
    }
  
    // Guests / general users: only see public quizzes
    // (also default case when sourcePage is not provided)
    filter.isPublic = true;
    if (orConditions.length > 0) filter.$or = orConditions;
    return filter;
  }
  
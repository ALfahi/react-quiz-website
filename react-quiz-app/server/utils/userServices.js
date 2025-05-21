// This script contains some useful helper functions which is needed for the user controller logic.
import Users from '../models/userModel.js';
import PendingUsers from '../models/pendingUserModel.js';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../utils/emailHelpers.js';
import { createEmailVerificationToken } from './emailHelpers.js';

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
        const token = createEmailVerificationToken({ username, email, password });;
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
 
// Checks if the password and username/ email matches the one in the database (returns boolean)
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
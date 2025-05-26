import jwt from 'jsonwebtoken';
import { isExistingUser, handleRequestVerification, createUser, invalidatePendingUserToken, 
    createPasswordResetToken, validatePasswordResetToken, updateUserPassword, isValidUser} from '../utils/userServices.js';
import {sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailHelpers.js';
import { createJwtToken } from '../utils/general.js';
import PendingUsers from '../models/pendingUserModel.js';
import Users from '../models/userModel.js';
// Route: POST /api/users/isDuplicateUser
// This function is used to allow the client side to check if a username exists or not.
export async function checkDuplicateUsername(req, res) 
{
    const { username } = req.body;

    try {
        const exists = await isExistingUser(username);
        res.status(200).json({ exists }); // { exists: true/false }
    } catch (err) {
        console.error('Error checking username:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Route: POST /api/users/request-verification
export async function requestVerification(req, res) {
    const { username, email, password } = req.body;

    const result = await handleRequestVerification({ username, email, password });

    if (result.success) {
        return res.status(200).json({ message: "Verification email sent. Please check your spam if you didn't see the email."});
    } else {
        return res.status(500).json({ message: 'Failed to send verification email' });
    }
}

//This function is used to specifically send a verification email to the user so they can activate their account:
//Route:POST/api/users/resendVerificationEmail
//
// This function allows the user to resend an email which will activate their account (registration)
//
export async function resendActivationEmail(req, res)
{
    const { username, email } = req.body;
    try {
        const pendingUser = await PendingUsers.findOne({ pendingEmail: email });

        if (!pendingUser) {
            return res.status(404).json({ message: 'No pending user found for this email.' });
        }
        // create new token
        const token = createJwtToken({
            username: pendingUser.pendingUsername,
            email: pendingUser.pendingEmail,
            password: pendingUser.pendingPassword // use hashed password from DB
        }, '5m');

        await invalidatePendingUserToken(email, token);// disable previous token
        await sendVerificationEmail(token, username, email);// resend the email

        return res.status(200).json({ message: 'Verification email resent successfully.' });
    } catch (err) {
        console.error('Error resending verification email:', err);
        return res.status(500).json({ message: 'Failed to resend verification email.' });
    }
}

// Route: POST /api/users/requestPasswordReset
// This function just sends an email to the user to make sure that the user owns the email that they typed in, the email will redirect
// user to the reset password page.
//
export async function requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            // Don't reveal whether the email exists for security
            return res.status(200).json({ message: "If the email is registered, a reset link is sent." });
        }

        const token = await createPasswordResetToken(email);
        await sendPasswordResetEmail(token, email, user.username);

        return res.status(200).json({ message: "If the email is registered, a reset link is sent."  });
    } catch (err) {
        console.error('Password reset error:', err);
        return res.status(500).json({ message: 'Failed to process request, please try again' });
    }
}

// This function is used to verify the email and then it will save the user information to the database (creating a user).
// if the account veriifcation is failed, the email is sent back so that the user can use the new tab to resend an email if needed.
//Route:GET/api/users/verifyEmail.
//
export async function verifyUser(req, res)
{
    const {token} = req.query;// grab the token, we are using .query for GET routes.
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded; // Extract email from the token

         // Check if the token is still valid (not expired)
         const pendingUser = await PendingUsers.findOne({ pendingEmail: email });
         if (!pendingUser) {
             return res.status(400).json({ message: 'No pending user found, please reregister.'});
         }
        if (token !== pendingUser.verificationToken)
        {
            return res.status(400).json({ message: 'Outdated Verification link, please use the newest link', email: email,  
                username: pendingUser.pendingUsername});
        }
        // Token expiration check: compare `updatedAt` timestamp with the current time
        const tokenExpirationTime = 5 * 60 * 1000; // 5 minutes
        const timeSinceLastUpdate = new Date() - new Date(pendingUser.updatedAt);

        if (timeSinceLastUpdate > tokenExpirationTime) {
            return res.status(400).json({ message: 'Verification link has expired. Please request a new one.', email: email, 
                username: pendingUser.pendingUsername});
        }

        // finally create the fully made account.
        const result = await createUser(pendingUser.pendingUsername, pendingUser.pendingEmail, pendingUser.pendingPassword);
        if (result.success)
        {
            return res.status(201).json({ message: 'Account verified and user created successfully'});
        }
    }
    catch (err) 
    {
        console.error('Verification failed:', err);
        return res.status(400).json({ message: 'Invalid or expired token, please reregister'});// or we can pass in email and username here so 
        // they can resend from that page.
    }
}

// This function will login the user to the website:
// route POST login
//
export async function loginUser(req, res)
{
    const {usernameOrEmail, password} = req.body;
    try{
        const isUserValid = await isValidUser(usernameOrEmail, password);// users can login with either email or username.
        if (!isUserValid)
        {
            return res.status(400).json({message: "invalid username or password"});
        }
        else
        {
            // getting the user so we can create the token.
            const user = await Users.findOne( {$or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]});
            const token = jwt.sign({ username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2m' });
            return res.status(202).json({token: token, message:"successfully logged in"});
        }
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

// This function is used to refresh a user's jwt token for when they want to stay logged in:
//
export function refreshLoginToken(req, res)
{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)// or just logout.
    {
        return res.status(401).json({ message: 'No token provided' });
    }
    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);// use the old token information to make the new one.

        const newToken = jwt.sign(
            { username: decoded.username, email: decoded.email, role: decoded.role},
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );

        return res.status(201).json({ token: newToken});// optional: add a message telling user that their session is renewed.
    } 
    catch (err) // just logout
    {
        res.status(403).json({ message: 'Invalid or expired token' });
    }

}

// This function verifies if the token is valid from the password reset email.
//Route:GET/api/users/verifyPasswordReset'
//
export async function verifyPasswordReset(req, res)
{
    const {token} = req.query;// getting the raw un hashed token.

    try {
        const user = await validatePasswordResetToken(token);// make sure that this matches with one from db and it isnt expired/ invalid.
        if (!user) 
        {
          return res.status(400).json({ message: 'Invalid or expired token, please resend the email or use most recent email' });
        }
        return res.status(200).json({ message: 'Token is valid', email: user.email });
      } 
      catch (err) 
      {
        console.error('Reset token validation error:', err);
        return res.status(500).json({ message: 'Something went wrong, please try again.' });
      }

}

// This function actually updates the password inside th actual db.
//Route:POST/api/users/resetPassword'
//
export async function resetPassword(req, res)
{
    const { token, newPassword } = req.body;
    try {
        const result = await updateUserPassword(token, newPassword);// update the new user password
        if (!result.success) {// e.g. token expired or user was not able to be found or some other server error
        return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({ message: 'Password has been reset successfully' });// password updated correctly.
    } 
    catch (err){
        console.error('Password reset error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

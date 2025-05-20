import jwt from 'jsonwebtoken';
import { isExistingUser, handleRequestVerification, createUser, invalidatePendingUserToken} from '../utils/userServices.js';
import { createEmailVerificationToken, sendVerificationEmail } from '../utils/emailHelpers.js';
import PendingUsers from '../models/pendingUserModel.js';

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
        const token = createEmailVerificationToken({
            username: pendingUser.pendingUsername,
            email: pendingUser.pendingEmail,
            password: pendingUser.pendingPassword // use hashed password from DB
        });

        await invalidatePendingUserToken(email, token);// disable previous token
        await sendVerificationEmail(token, username, email);// resend the email

        return res.status(200).json({ message: 'Verification email resent successfully.' });
    } catch (err) {
        console.error('Error resending verification email:', err);
        return res.status(500).json({ message: 'Failed to resend verification email.' });
    }
}


// This function is used to verify the email and then it will save the user information to the database (creating a user).
// if the account veriifcation is failed, the email is sent back so that the user can use the new tab to resend an email if needed.
//Route:POST/api/users/verifyEmail.
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
             return res.status(400).json({ message: 'No pending user found, please reregister.'});// TO DO somehow incoporate username/ email or redirect user to registration.
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
    const {username, password} = req.query;
    

}


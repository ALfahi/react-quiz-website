import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { getFileContent } from './general.js';

// This is a general function which is used to send an email.
//
async function sendMail(sender, recepient, subject, body)
{
    // logging into my email created for this website.
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // creating the actual email itself which will be sent.
    const mail = 
    {
        from: sender,
        to: recepient,
        subject: subject,
        html: body,
    }

    await transporter.sendMail(mail);
}

// This function is used to create the actual token which is needed for the user to validate their email (and then used to create the account)
// returns the actual token
//
export function createEmailVerificationToken({username, email, password})
{
    // creating a token to securely send email and recieve the email.
    const token = jwt.sign({ username, email, password },process.env.JWT_SECRET, { expiresIn: '5min' });
    return token;

}

//This function is used to specifically send a verification email to the user so they can activate their account:
//
export async function sendVerificationEmail(token, username, email)
{
    // this link will link back to the backend so that once user clicks on it, the verify user function will be run.
    const verificationLink = `http://localhost:5173/#/VerifyEmail?token=${token}`;
    // creating all the indiivisual components for the email sending:
    const sender = `"QuizMania" <${process.env.EMAIL}>`;
    const subject = 'Verify and create your QuizMania account';

    let body = getFileContent( '../emails/accountActivation.html')

    // Replace the placeholders with actual values
    body = body.replace('{{username}}', username)
            .replace('{{verificationLink}}', verificationLink);
    await sendMail(sender, email, subject, body);// actually sending the email
}

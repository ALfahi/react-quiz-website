import nodemailer from 'nodemailer';
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

// This is a general function to send emails with a specific template:
// optional replacements is an array of values inside emails which need to be replaced (adds more flexability) e.g. username: John Doe
// resetCode: 123 etc.
//
async function sendTemplatedEmail({token, email, subject, templatePath, redirectPage,optionalReplacements = {}  }) {
    const sender = `"QuizMania" <${process.env.EMAIL}>`;
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verificationLink = `${baseUrl}/#/${redirectPage}?token=${token}`;
  
    let body = getFileContent(templatePath);
  
    // Always replace the verification link
    body = body.replace('{{verificationLink}}', verificationLink);
  
    // Apply optional replacements (e.g., {{username}}, {{resetCode}})
    for (const [key, value] of Object.entries(optionalReplacements)) {
      const placeholder = `{{${key}}}`;
      body = body.replace(new RegExp(placeholder, 'g'), value);
    }
  
    await sendMail(sender, email, subject, body);
  }

/*******Publicly exposed functions *******/

//This function is used to specifically send a verification email to the user so they can activate their account:
//
export async function sendVerificationEmail(token, username, email) 
{
    await sendTemplatedEmail({token,email,
        subject: 'Verify and create your QuizMania account',templatePath: '../emails/accountActivation.html',
        redirectPage: 'Verify-email', optionalReplacements: {username}});
}

// This function is used to send an email specifically to reset the password.
//
export async function sendPasswordResetEmail(token, email, username) 
{
    await sendTemplatedEmail({
        token,email,
        subject: 'Reset your QuizMania password',templatePath: '../emails/passwordReset.html',
        redirectPage: 'forgotten-password', optionalReplacements: {username}});
}
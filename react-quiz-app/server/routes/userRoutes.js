import express from 'express';
import {requestVerification, resendActivationEmail, requestPasswordReset, verifyUser,
     checkDuplicateUsername, loginUser, refreshLoginToken, verifyPasswordReset, resetPassword} from '../controllers/userController.js';


const router = express.Router();
router.post('/sendVerificationEmail', requestVerification);
router.post('/resendVerificationEmail', resendActivationEmail);
router.post('/isDuplicateUser', checkDuplicateUsername)
router.get('/verifyEmail', verifyUser);
router.post('/sendResetPasswordEmail', requestPasswordReset)
router.post('/login', loginUser);
router.post('/refreshLogin', refreshLoginToken);
router.get('/verifyPasswordReset', verifyPasswordReset)
router.post('/resetPassword', resetPassword)

export default router;
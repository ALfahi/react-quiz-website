import express from 'express';
import {requestVerification, resendActivationEmail, verifyUser,
     checkDuplicateUsername, loginUser, refreshLoginToken} from '../controllers/userController.js';


const router = express.Router();
router.post('/sendVerificationEmail', requestVerification);
router.post('/resendVerificationEmail', resendActivationEmail);
router.post('/isDuplicateUser', checkDuplicateUsername)
router.get('/verifyEmail', verifyUser);
router.post('/login', loginUser);
router.post('/refreshLogin', refreshLoginToken);

export default router;
import express from 'express';
import {requestVerification, resendActivationEmail, verifyUser,
     checkDuplicateUsername, loginUser} from '../controllers/userController.js';


const router = express.Router();
router.post('/sendVerificationEmail', requestVerification);
router.post('/resendVerificationEmail', resendActivationEmail);
router.post('/isDuplicateUser', checkDuplicateUsername)
router.get('/verifyEmail', verifyUser);
router.post('/login', loginUser);

export default router;
import express from 'express';
import {
  signupValidator,
  loginValidator,
} from '../utils/validators/authValidator';
import {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} from '../services/auth';

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);
export default router;

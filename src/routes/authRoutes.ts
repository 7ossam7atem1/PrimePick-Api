import express from 'express';
import {
  signupValidator,
  loginValidator,
} from '../utils/validators/authValidator';
import { signup, login } from '../services/auth';

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);

export default router;

import express from 'express';
import { signupValidator } from '../utils/validators/authValidator';
import { signup } from '../services/auth';

const router = express.Router();

router.post('/signup', signupValidator, signup);

export default router;

import express from 'express';
import { registerUser, userLogin } from '../controller/authController.js';

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', userLogin)

export default router;
import express from 'express';
import { registerUser, userLogin, refreshToken, uploadDocument } from '../controller/authController.js';
import { upload } from '../utils/index.js';

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', userLogin);
router.post("/auth/refresh", refreshToken);
router.post("/upload", upload.single("document"), uploadDocument)

export default router;
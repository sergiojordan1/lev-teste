import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/me', authMiddleware, UserController.getUserInfo);

export default router;
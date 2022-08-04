import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
const router = Router();

// User
// @ts-ignore
router.post('/signup', UserController.signup);
router.post('/signin');
router.post('/signin/:new_token');
router.get('/logout');

// File

// Info

export { router };

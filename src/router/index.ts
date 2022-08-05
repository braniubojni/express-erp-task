import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
const router = Router();
import { body } from 'express-validator';
import authMiddlewares from '../middlewares/auth-middlewares';

const bodyDto = [
  body('id')
    .isString()
    .isLength({ min: 5 })
    .withMessage('Id must be at least 5 characters long'),
  body('password')
    .isString()
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long')
];

// User
// @ts-ignore
router.post('/signup', bodyDto[0], bodyDto[1], UserController.signup);
router.post('/signin', bodyDto[0], bodyDto[1], UserController.signin);
router.post('/signin/:new_token', UserController.signinNewToken);
router.get('/logout', UserController.logout);
router.get('/info', authMiddlewares, UserController.info);

// File

// Info

export { router };

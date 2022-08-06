import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { body } from 'express-validator';
import authMiddlewares from '../middlewares/auth-middlewares';
import { FileController } from '../controllers/file.controller';
const router = Router();

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
router.post('/signup', bodyDto[0], bodyDto[1], UserController.signup);
router.post('/signin', bodyDto[0], bodyDto[1], UserController.signin);
router.post('/signin/:new_token', UserController.signinNewToken);
router.get('/logout', UserController.logout);
router.get('/info', authMiddlewares, UserController.info);
// File
router.post('/file/upload', FileController.fileUpload);
router.get('/file/list', FileController.fileList);
router.delete('/file/delete/:id');
router.get('/file/:id');
router.get('/file/download/:id');
router.put('/file/update/:id');

export { router };

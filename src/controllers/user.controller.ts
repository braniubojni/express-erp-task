import { NextFunction, Request, Response } from 'express';
import { ExpressReturnType } from '../common/interfaces';
import { UserService } from '../services/user.service';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/api-error';

export class UserController {
  public static async signup(
    req: Request,
    res: ExpressReturnType,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(['Validation error', errors.array()]));
      }
      const { id, password } = req.body;
      const userData = await UserService.signup(id, password);
      res.cookie('user', userData.user, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      res.status(200).json({
        ...userData
      });
    } catch (error) {
      next(error);
    }
  }

  public static async signin(
    req: Request,
    res: ExpressReturnType,
    next: NextFunction
  ) {
    try {
      const { id, password } = req.body;
      const userData = await UserService.signin(id, password);

      res.cookie('user', userData.user, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });

      res.status(200).json({
        ...userData
      });
    } catch (error) {
      next(error);
    }
  }
  public static async signinNewToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken, user } = req.cookies;

      const userData = await UserService.refresh(refreshToken, user);
      res.cookie('user', userData.user, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
    } catch (error) {
      next(error);
    }
  }
  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.cookies;
      const token = await UserService.logout(user);
      res.clearCookie('refreshToken');
      res.cookie('refreshToken', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });

      return res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }

  public static async info(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.cookies;
      const userData = await UserService.info(user.user_id);
      return res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }
}

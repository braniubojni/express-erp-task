import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../exceptions/api-error';
import { TokenService } from '../services/token.service';

export interface IRequest extends Request {
  user?: string | JwtPayload;
}

export default function <T extends IRequest>(
  req: T,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.Unathorized());
    }

    const [bearer, token] = authHeader.split(' ');
    if (!token) {
      return next(ApiError.Unathorized());
    }
    const userData = TokenService.validateBearerToken(token);
    if (!userData) {
      return next(ApiError.Unathorized());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.Unathorized());
  }
}

import { Request, request, Response } from 'express';
import { UserDto } from './dtos/user.dto';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

// { user: UserDto; accessToken: string; refreshToken: string; }

export interface ISignUpReturn extends ITokens {
  user: UserDto;
}

export type ExpressReturnType = Response<any, Record<string, any>>;

export interface IUserController {
	signup: (req: Request, res: Response) => void;
	signin: (req: Request, res: Response) => void;
  signinNewToken: (req: Request, res: Response) => void;
  logout: (req: Request, res: Response) => void;
}
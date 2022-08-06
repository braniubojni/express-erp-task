import { Request, Response } from 'express';
import { UserDto } from './dtos/user.dto';

export interface ITokens {
  bearerToken: string;
  refreshToken: string;
}

// { user: UserDto; accessToken: string; refreshToken: string; }

export interface ISignUpReturn extends ITokens {
  user: UserDto;
}

export type ExpressReturnType = Response<any, Record<string, any>>;

export interface IFindQuery {
  skip?: number;
  take?: number;
}

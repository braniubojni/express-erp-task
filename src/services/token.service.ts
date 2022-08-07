import * as jwt from 'jsonwebtoken';
import { ITokens } from '../common/interfaces';
import { Token } from '../entitys/token-entity';

export class TokenService {
  public static generateTokens<T extends object>(payload: T): ITokens {
    const bearerToken = jwt.sign(
      payload,
      process.env.JWT_BEARER_SECRET || 'Secret-default-098',
      {
        expiresIn: '10m'
      }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'Secret-default-567',
      {
        expiresIn: '30d'
      }
    );

    return {
      bearerToken,
      refreshToken
    };
  }

  public static validateBearerToken(
    token: string
  ): jwt.JwtPayload | null | string {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_BEARER_SECRET || 'Secret-default'
      );
      return userData;
    } catch (error) {
      return null;
    }
  }

  public static validateRefreshToken(
    token: string
  ): jwt.JwtPayload | null | string {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'Secret-default'
      );
      return userData;
    } catch (error) {
      return null;
    }
  }

  public static async saveToken(
    userId: string,
    refresh_token: string
  ): Promise<Token> {
    const tokenData = await Token.getToken(userId);
    if (tokenData) {
      return await Token.saveData(userId, refresh_token);
    }
    const token = await Token.createData(userId, refresh_token);
    return token;
  }

  public static async getToken(userId: string): Promise<Token | null> {
    const tokenData = await Token.getToken(userId);

    return tokenData;
  }
}

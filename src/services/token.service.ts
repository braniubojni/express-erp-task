import * as jwt from 'jsonwebtoken';
import { ITokens } from '../common/interfaces';
import { Token } from '../entitys/token-entity';

export class TokenService {
  public static generateTokens<T extends object>(payload: T): ITokens {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET || 'Secret-default',
      {
        expiresIn: '10m'
      }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'Secret-default',
      {
        expiresIn: '30d'
      }
    );

    return {
      accessToken,
      refreshToken
    };
  }

  public static async saveToken(
    userId: string,
    refresh_token: string
  ): Promise<Token> {
    const tokenData = await Token.getToken(userId);
    if (tokenData) {
      console.log('tokenData___>', tokenData);
      return await Token.saveData(userId, refresh_token);
    }
    const token = await Token.createData(userId, refresh_token);
    return token;
  }
}

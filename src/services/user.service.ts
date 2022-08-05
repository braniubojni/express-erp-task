import { User } from '../entitys/user-entity';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UserDto } from '../common/dtos/user.dto';
import { ISignUpReturn } from '../common/interfaces';
import { ApiError } from '../exceptions/api-error';
import { Token } from '../entitys/token-entity';

export class UserService {
  private static async generateTokens(user_id: string): Promise<ISignUpReturn> {
    const userDto = new UserDto(user_id);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(user_id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    };
  }

  static async signup(
    userId: string,
    password: string
  ): Promise<ISignUpReturn> {
    try {
      const user = await User.getOne(userId);
      if (user) {
        throw ApiError.BadRequest(['User with such identifier already exists']);
      }
      const hashPassword = await bcrypt.hash(password, 5);

      const newUser = await User.createUser(userId, hashPassword);

      return await this.generateTokens(newUser.user_id);
    } catch (error) {
      if (error instanceof Error) {
        throw ApiError.BadRequest([error.message]);
      }
    }
    throw ApiError.BadRequest(['Error while signing up']);
  }

  static async signin(
    userId: string,
    password: string
  ): Promise<ISignUpReturn> {
    const user = await User.getOne(userId);

    if (!user) {
      throw ApiError.BadRequest(['User with such identifier does not exist']);
    }
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      throw ApiError.BadRequest(['Invalid password']);
    }

    return await this.generateTokens(userId);
  }

  static async logout({ userId }: UserDto) {
    const tokens = await this.generateTokens(userId);
    return tokens;
  }

  static async refresh(refreshToken: string, userId: string) {
    if (!refreshToken) throw ApiError.BadRequest(['No refresh token']);
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await Token.getToken(userId);

    if (!tokenFromDb || !userData) {
      throw ApiError.Unathorized();
    }

    return await this.generateTokens(userId);
  }

  static async info(userId: string) {
    const user = await User.getOne(userId);
    if (!user) {
      throw ApiError.BadRequest(['User with such identifier does not exist']);
    }
    return new UserDto(user.user_id);
  }
}

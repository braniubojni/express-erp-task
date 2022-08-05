import { User } from '../entitys/user-entity';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UserDto } from '../common/dtos/user.dto';
import { ISignUpReturn } from '../common/interfaces';

export class UserService {
  static async signup(userId: string, password: string): Promise<ISignUpReturn> {
    try {
      const user = await User.getOne(userId, password);
      if (user) {
        throw new Error('User with such identifier already exists');
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const newUser = await User.addUser(userId, hashPassword);

      const userDto = new UserDto(newUser.user_id, newUser.password);
      const tokens = TokenService.generateTokens({ ...userDto });

      await TokenService.saveToken(newUser.user_id, tokens.refreshToken);

      return {
        ...tokens,
        user: userDto
      }
    } catch (error) {
      if(error instanceof Error) {
        throw new Error(error.message);
      }
    }
    throw new Error('Error while signing up');
  }
}

import { User } from '../entitys/user-entity';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';

export class UserService {
  async signup(userId: string, password: string): Promise<void> {
    try {
      const user = await User.getOne(userId, password);
      if (user) {
        throw new Error('User with such identifier already exists');
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const newUser = await User.addUser(userId, hashPassword);
      const tokens = TokenService.generateTokens(newUser);
    } catch (error) {}
  }
}

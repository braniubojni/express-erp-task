import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { dataSource } from '../db-connect';
import { User } from './user-entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1024, nullable: false })
  refresh_token: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  public static async getToken(userId: string): Promise<Token | null> {
    const token = await dataSource.getRepository(Token).findOne({
      where: {
        user: {
          user_id: userId
        }
      }
    });

    return token;
  }

  public static async saveData(
    userId: string,
    refresh_token: string
  ): Promise<Token> {
    const token = await Token.getToken(userId);
    if (token) {
      token.refresh_token = refresh_token;
      return await dataSource.getRepository(Token).save(token);
    }
    return await Token.createData(userId, refresh_token);
  }

  public static async createData(
    userId: string,
    refresh_token: string
  ): Promise<Token> {
    const user = await User.getOne(userId);
    if (!user) {
      throw new Error('User with such identifier does not exist');
    }
    const token = await dataSource.getRepository(Token).save({
      user,
      refresh_token: refresh_token
    });

    return token;
  }
}

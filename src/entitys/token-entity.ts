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

  @Column({ length: 255, nullable: false })
  refresh_token: string;

  @OneToOne((type) => User, (user) => user.token)
  @JoinColumn()
  user: User;

  public static async getToken(userId: number): Promise<Token | null> {
    const token = await dataSource.getRepository(Token).findOne({
      where: {
        user: {
          id: userId
        }
      }
    });

    return token;
  }

  public static async saveData(
    userId: number,
    refresh_token: string
  ): Promise<Token> {
    const token = await dataSource.getRepository(Token).save({
      user: {
        id: userId
      },
      refresh_token: refresh_token
    });

    return token;
  }

  public static async createData(
    userId: number,
    refresh_token: string
  ): Promise<Token> {
    const token = await dataSource.getRepository(Token).save({
      user: {
        id: userId
      },
      refresh_token: refresh_token
    });

    return token;
  }
}

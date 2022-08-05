import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { dataSource } from '../db-connect';
import { Token } from './token-entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255, nullable: false })
  user_id: string;

  @Column({ length: 255, nullable: false })
  password: string;

  public static async getOne(userId: string): Promise<User | null> {
    const user = await dataSource.getRepository(User).findOne({
      where: {
        user_id: userId
      }
    });
    return user;
  }

  public static async createUser(
    userId: string,
    password: string
  ): Promise<User> {
    try {
      const user = await dataSource.getRepository(User).save({
        user_id: userId,
        password: password
      });
      return user;
    } catch (error) {
      throw new Error('Error while adding user');
    }
  }
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { dataSource } from '../db-connect';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255, nullable: false })
  user_id: string;

  @Column({ length: 255, nullable: false })
  password: string;

  token: string;

  public static async getOne(
    userId: string,
    password: string
  ): Promise<User | null> {
    try {
      const user = await dataSource.getRepository(User).findOne({
        where: {
          user_id: userId,
          password: password
        }
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  public static async addUser(userId: string, password: string): Promise<User> {
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

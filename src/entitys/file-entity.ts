import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IFindQuery } from '../common/interfaces';
import { dataSource } from '../db-connect';
import { ApiError } from '../exceptions/api-error';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1024, nullable: false })
  file_name: string;

  @Column({ length: 255, nullable: false })
  extension: string;

  @Column({ length: 1024, nullable: false })
  mime_type: string;

  @Column({ nullable: false })
  size: number;

  @Column({ nullable: false })
  date_created: Date;

  public static async createFile(
    file_name: string,
    extension: string,
    mime_type: string,
    size: number,
    date_created: Date
  ): Promise<File> {
    const file = await dataSource.getRepository(File).save({
      file_name,
      extension,
      mime_type,
      size,
      date_created
    });

    return file;
  }

  public static async updateById(
    id: number,
    file_name: string,
    extension: string,
    mime_type: string,
    size: number,
    date_created: Date
  ): Promise<File | null> {
    try {
      let file = await this.findById(id);

      if (file) {
        file = {
          ...file,
          file_name,
          extension,
          mime_type,
          size,
          date_created
        };
        return await dataSource.getRepository(File).save(file);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async find(findQuery: IFindQuery): Promise<File[]> {
    const { skip, take } = findQuery;
    const files = await dataSource.getRepository(File).find({
      skip,
      take
    });

    return files;
  }

  public static async findById(id: number): Promise<File | null> {
    try {
      const file = await dataSource.getRepository(File).findOneBy({ id });

      return file;
    } catch (error) {
      return null;
    }
  }

  public static async removeById(id: number): Promise<File | null> {
    const file = await this.findById(id);
    if (file) {
      return await dataSource.getRepository(File).remove(file);
    }
    return null;
  }
}

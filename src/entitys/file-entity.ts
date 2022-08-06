import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dataSource } from '../db-connect';

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
}

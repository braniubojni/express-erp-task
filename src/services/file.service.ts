import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { File } from '../entitys/file-entity';
import { ApiError } from '../exceptions/api-error';

export class FileService {
  public static filesPath: string = path.resolve(
    __dirname,
    '..',
    'static',
    'files'
  );
  public static async fileUpload(req: Request) {
    if (req.busboy) {
      let fstream: fs.WriteStream;
      req.pipe(req.busboy);
      req.busboy.on('file', (fieldname, file, { filename, mimeType }) => {
        filename = filename.replace(' ', '_');
        const idx = filename.lastIndexOf('.');
        const extension = filename.slice(idx + 1);
        const fileName = filename.slice(0, idx);

        if (!fs.existsSync(this.filesPath)) {
          fs.mkdirSync(this.filesPath, { recursive: true });
        }

        fstream = fs.createWriteStream(path.resolve(this.filesPath, filename));
        file.pipe(fstream);

        fstream.on('close', async () => {
          const date = new Date();
          const size = fs.statSync(fstream.path).size;
          await File.createFile(fileName, extension, mimeType, size, date);
        });

        fstream.on('error', (err) => {
          throw ApiError.BadRequest([err.message, 500]);
        });
      });
    }
  }

  public static async fileList(list_size: number, page: number) {
    const files = await File.find({
      skip: list_size * (page - 1),
      take: list_size
    });
    return files;
  }

  public static async removeFile(id: number) {
    // Remove from db
    const fileInfo = await File.removeById(id);
    if (fileInfo) {
      const { file_name, extension } = fileInfo;
      const filePath = `${this.filesPath}/${file_name}.${extension}`;
      // Remove local
      fs.unlinkSync(filePath);

      return fileInfo;
    }
  }
}

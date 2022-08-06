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

  private static removeStaticFile(fileInfo: File): File {
    const { file_name, extension } = fileInfo;
    const filePath = `${this.filesPath}/${file_name}.${extension}`;
    // Remove local
    fs.unlinkSync(filePath);

    return fileInfo;
  }

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
      this.removeStaticFile(fileInfo);
    }
    throw ApiError.NotFound(['File not found', 404]);
  }

  public static async findById(id: number): Promise<File | null> {
    // Remove from db
    const file = await File.findById(id);

    if (!file) throw ApiError.NotFound(['File not found', 404]);

    return file;
  }

  public static async downloadFile(id: number): Promise<string> {
    const file = await File.findById(id);

    if (file) {
      const { file_name, extension } = file;
      const filePath = `${this.filesPath}/${file_name}.${extension}`;
      return filePath;
    }
    throw ApiError.NotFound(['File not found', 404]);
  }

  public static async updateFile(req: Request) {
    const dbFile = await File.findById(+req.params.id);
    if (!dbFile) throw ApiError.NotFound(['File not found', 404]);
    if (req.busboy) {
      let fstream: fs.WriteStream;
      req.pipe(req.busboy);
      req.busboy.on('file', (fieldname, file, { filename, mimeType }) => {
        filename = filename.replace(' ', '_');
        const idx = filename.lastIndexOf('.');
        const newExtension = filename.slice(idx + 1);
        const newFileName = filename.slice(0, idx);

        if (!fs.existsSync(this.filesPath)) {
          throw ApiError.BadRequest(['Files folder not found', 500]);
        }

        fstream = fs.createWriteStream(path.resolve(this.filesPath, filename));
        file.pipe(fstream);

        fstream.on('close', async () => {
          const newDate = new Date();
          const newSize = fs.statSync(fstream.path).size;

          this.removeStaticFile(dbFile);

          const data = await File.updateById(
            dbFile.id,
            newFileName,
            newExtension,
            mimeType,
            newSize,
            newDate
          );
        });

        fstream.on('error', (err) => {
          throw ApiError.BadRequest([err.message, 500]);
        });
      });
    }
  }
}

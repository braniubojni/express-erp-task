import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { File } from '../entitys/file-entity';
import { ApiError } from '../exceptions/api-error';

export class FileService {
  public static async fileUpload(req: Request) {
    if (req.busboy) {
      let fstream: fs.WriteStream;
      req.pipe(req.busboy);
      req.busboy.on('file', (fieldname, file, { filename, mimeType }) => {
        const idx = filename.lastIndexOf('.');
        const extension = filename.slice(idx + 1);
        const fileName = filename.slice(0, idx);
        const filePath = path.resolve(__dirname, '..', 'static', 'files');
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        fstream = fs.createWriteStream(path.resolve(filePath, filename));
        file.pipe(fstream);

        fstream.on('close', () => {
          const date = new Date();
          const size = fs.statSync(fstream.path).size;
          File.createFile(fileName, extension, mimeType, size, date)
            .then((file) => {
              console.log('Saved');
            })
            .catch((err) => {
              ApiError.BadRequest([
                `Error while creating file: ${err.message}`
              ]);
            });
        });

        fstream.on('error', (err) => {
          throw ApiError.BadRequest([err.message, 500]);
        });
      });
    }
  }
}

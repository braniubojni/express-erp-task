import { NextFunction, Request } from 'express';
import fs from 'fs';
import path from 'path';
import { IFileUpload } from '../common/interfaces';
import { ApiError } from '../exceptions/api-error';

export class FileService {
  public static async fileUpload({ req, name }: IFileUpload) {
    // @ts-ignore
    // Save in db
    name;
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);

      stream.on('open', () => {
        console.log('Stream open ... 0.00%');
        req.pipe(stream);
      });

      stream.on('drain', () => {
        const written = parseInt(stream.bytesWritten.toString(), 10);
        const total = parseInt(stream.bytesWritten.toString(), 10);
        const pWritten = ((written / total) * 100).toFixed(2);
        console.log(`Stream drain ... ${pWritten}% done`);
      });

      stream.on('close', () => {
        console.log('Stream open ... 100%');
        resolve(filePath);
      });

      stream.on('error', (err) => {
        next(ApiError.BadRequest([err.message]));
        reject(err);
      });
    });
  }
}

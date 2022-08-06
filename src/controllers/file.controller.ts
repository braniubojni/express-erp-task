import { NextFunction, Request, Response } from 'express';
import { FileService } from '../services/file.service';

export class FileController {
  public static async fileUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await FileService.fileUpload(req);
      res.status(201).send({
        message: 'File uploaded successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

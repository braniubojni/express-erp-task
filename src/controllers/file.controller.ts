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

  public static async fileList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { list_size = 10, page = 1 } = req.query;
      const files = await FileService.fileList(+list_size, +page);
      res.status(200).send(files);
    } catch (error) {
      next(error);
    }
  }
}

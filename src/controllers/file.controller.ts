import { NextFunction, Request, Response } from 'express';
import { FileService } from '../services/file.service';

export class FileController {
  public static async fileUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = req.body;
      console.log(name);
      const fileResult = await FileService.fileUpload({
        req,
        name
      });
      res.send('OK');
    } catch (error) {
      next(error);
    }
  }
}